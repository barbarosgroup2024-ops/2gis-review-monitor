-- Проверка текущих политик безопасности в Supabase
-- Выполните этот код в Supabase SQL Editor

-- 1. Проверка политик для таблицы users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('users', 'subscriptions', 'companies', 'reviews')
ORDER BY tablename, policyname;

-- 2. Проверка, включен ли RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('users', 'subscriptions', 'companies', 'reviews')
  AND schemaname = 'public';

-- 3. Тестовый запрос (должен работать)
SELECT COUNT(*) as user_count FROM users;