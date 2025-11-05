-- Ajustes de cadastro e verificação de email
-- Objetivo: garantir que ao cadastrar um usuário via Supabase Auth (email/password)
-- 1) um registro seja criado em public.dim_usuarios com perfil_id = 4 (Visualizador)
-- 2) o usuário permaneça aguardando verificação por email (fluxo padrão do Supabase)
-- 3) manter segurança com RLS e evitar que o front faça inserts diretos

-- 0) Pré-condições de dados: garantir a existência do perfil 4 "Visualizador"
INSERT INTO public.dim_perfis (id, nome)
SELECT 4, 'Visualizador'
WHERE NOT EXISTS (SELECT 1 FROM public.dim_perfis WHERE id = 4);

-- 1) Garantir unicidade por user_id (necessário para ON CONFLICT abaixo)
CREATE UNIQUE INDEX IF NOT EXISTS dim_usuarios_user_id_key
  ON public.dim_usuarios (user_id);

-- 2) Recriar a função do trigger de novo usuário (robusta e segura)
-- Observações importantes:
-- - SECURITY DEFINER: executa com privilégios do dono da função (owner), evitando bloqueios por RLS
-- - SET search_path = public: evita problemas de schema e segurança
-- - Insere com perfil_id = 4 (Visualizador) por padrão
-- - Usa ON CONFLICT para atualizar dados se o usuário já existir
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _nome text;
BEGIN
  -- Garantir que o perfil Visualizador (id=4) exista
  IF NOT EXISTS (SELECT 1 FROM public.dim_perfis WHERE id = 4) THEN
    BEGIN
      INSERT INTO public.dim_perfis (id, nome) VALUES (4, 'Visualizador');
    EXCEPTION WHEN OTHERS THEN
      -- Evitar que qualquer erro aqui quebre o cadastro do usuário
      NULL;
    END;
  END IF;

  -- Normalizar nome: usa metadado "nome" se houver, senão o email
  _nome := COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email);

  -- Inserir/atualizar o usuário em dim_usuarios
  INSERT INTO public.dim_usuarios (user_id, nome, email, perfil_id, created_at)
  VALUES (
    NEW.id,
    _nome,
    NEW.email,
    4, -- Perfil default: Visualizador
    NOW() AT TIME ZONE 'America/Fortaleza'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    nome      = COALESCE(EXCLUDED.nome, public.dim_usuarios.nome),
    email     = COALESCE(EXCLUDED.email, public.dim_usuarios.email),
    -- Não sobrescreve perfil existente; mantém o atual, senão usa 4
    perfil_id = COALESCE(public.dim_usuarios.perfil_id, 4);

  RETURN NEW;
END;
$$;

-- 3) Criar (ou recriar) o trigger para disparar após inserir na auth.users
-- Importante: não confirmar email aqui; o fluxo de verificação por email do Supabase
-- permanece padrão (email_confirmed_at NULL até o usuário confirmar pelo link recebido).
DO $$
BEGIN
  -- Remove trigger existente, se houver
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created' AND n.nspname = 'auth' AND c.relname = 'users'
  ) THEN
    EXECUTE 'DROP TRIGGER on_auth_user_created ON auth.users';
  END IF;

  -- Cria o trigger novamente apontando para a função acima
  EXECUTE 'CREATE TRIGGER on_auth_user_created
           AFTER INSERT ON auth.users
           FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user()';
END $$;

-- 4) Remover função custom_signup (não recomendada) para evitar cadastros diretos
--    na tabela auth.users e burlar o fluxo de verificação de email do Supabase.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'custom_signup'
  ) THEN
    EXECUTE 'DROP FUNCTION public.custom_signup(text, text, text)';
  END IF;
END $$;