-- ========================
-- Примеры SQL запросов для Supabase
-- ========================

-- ========================
-- ПОЛЬЗОВАТЕЛИ
-- ========================

-- Получить всех пользователей
SELECT * FROM users ORDER BY created_at DESC;

-- Найти пользователя по email
SELECT * FROM users WHERE email = 'user@example.com';

-- Получить активных пользователей
SELECT * FROM users WHERE status = 'active';

-- Количество пользователей по статусу
SELECT status, COUNT(*) as count 
FROM users 
GROUP BY status;

-- ========================
-- ПОДПИСКИ
-- ========================

-- Получить все активные подписки
SELECT 
  u.name,
  u.email,
  s.plan,
  s.start_date,
  s.end_date,
  s.status
FROM subscriptions s
JOIN users u ON u.id = s.user_id
WHERE s.status = 'active'
ORDER BY s.end_date;

-- Подписки, которые истекают в ближайшие 7 дней
SELECT 
  u.name,
  u.email,
  s.plan,
  s.end_date,
  (s.end_date - NOW()) as time_left
FROM subscriptions s
JOIN users u ON u.id = s.user_id
WHERE s.end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  AND s.status = 'active';

-- Количество подписок по планам
SELECT plan, COUNT(*) as count 
FROM subscriptions 
WHERE status = 'active'
GROUP BY plan;

-- ========================
-- КОМПАНИИ
-- ========================

-- Получить все активные компании
SELECT * FROM companies WHERE active = true;

-- Компании с количеством отзывов
SELECT 
  c.company_name,
  c.active,
  COUNT(r.id) as review_count,
  MAX(r.date_created) as last_review_date
FROM companies c
LEFT JOIN reviews r ON r.company_id = c.id
GROUP BY c.id, c.company_name, c.active
ORDER BY review_count DESC;

-- Компании пользователя
SELECT 
  c.*,
  COUNT(r.id) as review_count
FROM companies c
LEFT JOIN reviews r ON r.company_id = c.id
WHERE c.user_id = 'USER_ID_HERE'
GROUP BY c.id;

-- ========================
-- ОТЗЫВЫ
-- ========================

-- Последние 10 отзывов
SELECT 
  c.company_name,
  r.user_name,
  r.rating,
  r.review_text,
  r.date_created
FROM reviews r
JOIN companies c ON c.id = r.company_id
ORDER BY r.date_created DESC
LIMIT 10;

-- Отзывы за сегодня
SELECT 
  c.company_name,
  r.user_name,
  r.rating,
  r.review_text,
  r.date_created
FROM reviews r
JOIN companies c ON c.id = r.company_id
WHERE r.date_created >= CURRENT_DATE
ORDER BY r.date_created DESC;

-- Отзывы за последнюю неделю
SELECT 
  c.company_name,
  COUNT(*) as review_count,
  AVG(r.rating) as avg_rating
FROM reviews r
JOIN companies c ON c.id = r.company_id
WHERE r.date_created >= NOW() - INTERVAL '7 days'
GROUP BY c.id, c.company_name
ORDER BY review_count DESC;

-- Распределение по рейтингам
SELECT 
  rating,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM reviews
GROUP BY rating
ORDER BY rating DESC;

-- Отзывы, которые еще не отправлены в Telegram
SELECT 
  c.company_name,
  c.telegram_chat_id,
  r.*
FROM reviews r
JOIN companies c ON c.id = r.company_id
WHERE r.sent_to_telegram = false
  AND c.active = true
ORDER BY r.date_created;

-- ========================
-- СТАТИСТИКА
-- ========================

-- Общая статистика по компании
SELECT 
  c.company_name,
  COUNT(r.id) as total_reviews,
  AVG(r.rating) as avg_rating,
  MIN(r.date_created) as first_review,
  MAX(r.date_created) as last_review,
  COUNT(CASE WHEN r.date_created >= CURRENT_DATE THEN 1 END) as today_count,
  COUNT(CASE WHEN r.date_created >= CURRENT_DATE - INTERVAL '1 day' 
             AND r.date_created < CURRENT_DATE THEN 1 END) as yesterday_count,
  COUNT(CASE WHEN r.date_created >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_count,
  COUNT(CASE WHEN r.date_created >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_count
FROM companies c
LEFT JOIN reviews r ON r.company_id = c.id
WHERE c.id = 'COMPANY_ID_HERE'
GROUP BY c.id, c.company_name;

-- Использование представления review_stats
SELECT * FROM review_stats WHERE company_id = 'COMPANY_ID_HERE';

-- Топ компаний по количеству отзывов
SELECT 
  c.company_name,
  u.name as owner_name,
  COUNT(r.id) as review_count,
  AVG(r.rating) as avg_rating
FROM companies c
JOIN users u ON u.id = c.user_id
LEFT JOIN reviews r ON r.company_id = c.id
GROUP BY c.id, c.company_name, u.name
ORDER BY review_count DESC
LIMIT 10;

-- Активность по дням недели
SELECT 
  TO_CHAR(date_created, 'Day') as day_of_week,
  COUNT(*) as review_count
FROM reviews
WHERE date_created >= NOW() - INTERVAL '30 days'
GROUP BY TO_CHAR(date_created, 'Day'), EXTRACT(DOW FROM date_created)
ORDER BY EXTRACT(DOW FROM date_created);

-- Активность по часам
SELECT 
  EXTRACT(HOUR FROM date_created) as hour,
  COUNT(*) as review_count
FROM reviews
WHERE date_created >= NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM date_created)
ORDER BY hour;

-- ========================
-- ОБСЛУЖИВАНИЕ
-- ========================

-- Удалить старые отзывы (старше 1 года)
-- ВНИМАНИЕ: Это удалит данные!
-- DELETE FROM reviews WHERE date_created < NOW() - INTERVAL '1 year';

-- Обновить статус неактивных подписок
UPDATE subscriptions 
SET status = 'expired' 
WHERE end_date < NOW() 
  AND status = 'active';

-- Деактивировать компании с истекшей подпиской
UPDATE companies c
SET active = false
FROM subscriptions s
WHERE c.user_id = s.user_id
  AND s.status != 'active';

-- Очистить флаг sent_to_telegram для повторной отправки
-- UPDATE reviews SET sent_to_telegram = false WHERE company_id = 'COMPANY_ID_HERE';

-- ========================
-- АНАЛИТИКА
-- ========================

-- Рост пользователей по месяцам
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as total_users
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Конверсия trial → paid
SELECT 
  COUNT(CASE WHEN plan = 'trial' THEN 1 END) as trial_count,
  COUNT(CASE WHEN plan != 'trial' THEN 1 END) as paid_count,
  ROUND(
    COUNT(CASE WHEN plan != 'trial' THEN 1 END) * 100.0 / 
    COUNT(*), 2
  ) as conversion_rate
FROM subscriptions;

-- Средний рейтинг по компаниям
SELECT 
  c.company_name,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating), 2) as avg_rating,
  COUNT(CASE WHEN r.rating >= 4 THEN 1 END) as positive_count,
  COUNT(CASE WHEN r.rating <= 2 THEN 1 END) as negative_count
FROM companies c
LEFT JOIN reviews r ON r.company_id = c.id
GROUP BY c.id, c.company_name
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC;

-- ========================
-- ПОЛЕЗНЫЕ ФУНКЦИИ
-- ========================

-- Создать функцию для получения статистики компании
CREATE OR REPLACE FUNCTION get_company_stats(company_uuid UUID)
RETURNS TABLE (
  total_reviews BIGINT,
  avg_rating NUMERIC,
  today_count BIGINT,
  week_count BIGINT,
  month_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(r.id) as total_reviews,
    ROUND(AVG(r.rating), 2) as avg_rating,
    COUNT(CASE WHEN r.date_created >= CURRENT_DATE THEN 1 END) as today_count,
    COUNT(CASE WHEN r.date_created >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_count,
    COUNT(CASE WHEN r.date_created >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_count
  FROM reviews r
  WHERE r.company_id = company_uuid;
END;
$$ LANGUAGE plpgsql;

-- Использование функции:
-- SELECT * FROM get_company_stats('COMPANY_ID_HERE');

-- ========================
-- БЭКАПЫ И ЭКСПОРТ
-- ========================

-- Экспорт всех пользователей в CSV (через Supabase Dashboard)
-- Table Editor → users → Export → CSV

-- Экспорт отзывов компании
COPY (
  SELECT 
    r.two_gis_review_id,
    r.date_created,
    r.user_name,
    r.rating,
    r.review_text
  FROM reviews r
  WHERE r.company_id = 'COMPANY_ID_HERE'
  ORDER BY r.date_created DESC
) TO '/tmp/reviews_export.csv' WITH CSV HEADER;

-- ========================
-- МОНИТОРИНГ
-- ========================

-- Размер таблиц
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Количество записей в таблицах
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;

-- Последняя активность
SELECT 
  'users' as table_name, MAX(created_at) as last_activity FROM users
UNION ALL
SELECT 'companies', MAX(created_at) FROM companies
UNION ALL
SELECT 'reviews', MAX(created_at) FROM reviews;