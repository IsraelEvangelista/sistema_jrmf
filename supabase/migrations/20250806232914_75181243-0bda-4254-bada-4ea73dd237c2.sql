-- Corrigir função com search_path adequado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
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