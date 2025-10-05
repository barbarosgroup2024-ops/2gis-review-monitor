-- Проверка наличия таблиц в Supabase
-- Выполните этот код в Supabase SQL Editor

-- 1. Список всех таблиц
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Структура таблицы users
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Проверка данных
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;