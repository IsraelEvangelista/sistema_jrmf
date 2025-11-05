-- Remover todas as funções existentes
DROP FUNCTION IF EXISTS public.fn_dashboard_crescimento(integer);
DROP FUNCTION IF EXISTS public.fn_crescimento_gerencia(integer);
DROP FUNCTION IF EXISTS public.fn_pct_faturado_consumo_categoria(integer);
DROP FUNCTION IF EXISTS public.fn_crescimento_categoria(integer);
DROP FUNCTION IF EXISTS public.fn_faturamento_mensal(integer);
DROP FUNCTION IF EXISTS public.fn_pct_faturado_consumo(integer);
DROP FUNCTION IF EXISTS public.fn_taxa_crescimento(integer);
DROP FUNCTION IF EXISTS public.fn_top4_clientes(integer);

-- Remover todas as políticas RLS das tabelas usuarios, perfis e usuarios_perfis
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários autenticados podem ver perfis" ON public.perfis;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.usuarios_perfis;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON public.usuarios_perfis;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.usuarios_perfis;

-- Renomear tabelas seguindo padrão DW
ALTER TABLE public.usuarios RENAME TO dim_usuarios;
ALTER TABLE public.perfis RENAME TO dim_perfis;

-- Remover tabela de relacionamento desnecessária
DROP TABLE IF EXISTS public.usuarios_perfis;

-- Adicionar FK de perfil_id na tabela dim_usuarios
ALTER TABLE public.dim_usuarios 
ADD COLUMN perfil_id INTEGER REFERENCES public.dim_perfis(id);

-- Criar nova estrutura de perfis padrão
INSERT INTO public.dim_perfis (nome) VALUES 
('Administrador'),
('Gestor'),
('Analista'),
('Visualizador')
ON CONFLICT DO NOTHING;

-- Atualizar usuários existentes para ter perfil padrão (analista)
UPDATE public.dim_usuarios 
SET perfil_id = (SELECT id FROM public.dim_perfis WHERE nome = 'Analista' LIMIT 1)
WHERE perfil_id IS NULL;

-- Criar função para handle de novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.dim_usuarios (user_id, nome, email, perfil_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email),
    NEW.email,
    (SELECT id FROM public.dim_perfis WHERE nome = 'Analista' LIMIT 1)
  );
  RETURN NEW;
END;
$$;

-- Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS nas tabelas
ALTER TABLE public.dim_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dim_perfis ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para dim_usuarios
CREATE POLICY "Usuários podem ver seus próprios dados"
ON public.dim_usuarios
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON public.dim_usuarios
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode inserir novos usuários"
ON public.dim_usuarios
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Criar políticas RLS para dim_perfis
CREATE POLICY "Usuários autenticados podem ver perfis"
ON public.dim_perfis
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Política para administradores gerenciarem perfis
CREATE POLICY "Administradores podem gerenciar perfis"
ON public.dim_perfis
FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id FROM public.dim_usuarios 
    WHERE perfil_id = (SELECT id FROM public.dim_perfis WHERE nome = 'Administrador')
  )
);