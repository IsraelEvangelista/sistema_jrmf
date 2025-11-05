-- Remover função de teste não utilizada para reduzir superfície de ataque
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'test_direct_user_insert'
  ) THEN
    EXECUTE 'DROP FUNCTION public.test_direct_user_insert()';
  END IF;
END $$;