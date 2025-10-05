-- ============================================================
-- Миграция: Единый Telegram бот для всех компаний
-- Дата: 2025-01-10
-- Описание: 
--   - Добавляет поддержку единого Telegram бота
--   - Пользователь вводит ссылку на профиль компании в 2GIS
--   - Администратор настраивает параметры для каждой компании
--   - Пользователь активирует бота по уникальному коду
-- ============================================================

-- ============================================================
-- Шаг 1: Добавляем новые поля в таблицу companies
-- ============================================================

-- Ссылка на профиль компании в 2GIS (которую вводит пользователь)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS two_gis_profile_url TEXT;

-- Уникальный код для активации Telegram бота
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS telegram_activation_code VARCHAR(50) UNIQUE;

-- ID пользователя Telegram (после активации)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS telegram_user_id VARCHAR(50);

-- Username пользователя Telegram
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(255);

-- Статус активации бота
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS telegram_activated BOOLEAN DEFAULT false;

-- Дата активации бота
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS telegram_activated_at TIMESTAMP WITH TIME ZONE;

-- Интервал проверки отзывов в минутах (настраивается админом)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS check_interval_minutes INTEGER DEFAULT 5;

-- Минимальный рейтинг для отправки (null = все отзывы)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS min_rating_filter INTEGER CHECK (min_rating_filter >= 1 AND min_rating_filter <= 5);

-- Максимальный рейтинг для отправки (null = все отзывы)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS max_rating_filter INTEGER CHECK (max_rating_filter >= 1 AND max_rating_filter <= 5);

-- Время последней проверки отзывов
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS last_check_at TIMESTAMP WITH TIME ZONE;

-- Включена ли отправка отзывов в Telegram
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS telegram_notifications_enabled BOOLEAN DEFAULT true;

-- ============================================================
-- Шаг 2: Создаем индексы для новых полей
-- ============================================================

-- Индекс для быстрого поиска по коду активации
CREATE INDEX IF NOT EXISTS idx_companies_activation_code 
ON companies(telegram_activation_code) 
WHERE telegram_activation_code IS NOT NULL;

-- Индекс для быстрого поиска по Telegram User ID
CREATE INDEX IF NOT EXISTS idx_companies_telegram_user_id 
ON companies(telegram_user_id) 
WHERE telegram_user_id IS NOT NULL;

-- Индекс для поиска активированных компаний
CREATE INDEX IF NOT EXISTS idx_companies_telegram_activated 
ON companies(telegram_activated) 
WHERE telegram_activated = true;

-- Индекс для планировщика (поиск компаний, которым пора проверять отзывы)
CREATE INDEX IF NOT EXISTS idx_companies_last_check 
ON companies(last_check_at, active, telegram_activated);

-- ============================================================
-- Шаг 3: Добавляем комментарии к полям
-- ============================================================

COMMENT ON COLUMN companies.two_gis_profile_url IS 'Ссылка на профиль компании в 2GIS (вводит пользователь)';
COMMENT ON COLUMN companies.telegram_activation_code IS 'Уникальный код для активации Telegram бота';
COMMENT ON COLUMN companies.telegram_user_id IS 'ID пользователя Telegram (после активации)';
COMMENT ON COLUMN companies.telegram_username IS 'Username пользователя в Telegram';
COMMENT ON COLUMN companies.telegram_activated IS 'Активирован ли Telegram бот для этой компании';
COMMENT ON COLUMN companies.telegram_activated_at IS 'Дата и время активации бота';
COMMENT ON COLUMN companies.check_interval_minutes IS 'Интервал проверки новых отзывов в минутах';
COMMENT ON COLUMN companies.min_rating_filter IS 'Минимальный рейтинг для отправки (null = все)';
COMMENT ON COLUMN companies.max_rating_filter IS 'Максимальный рейтинг для отправки (null = все)';
COMMENT ON COLUMN companies.last_check_at IS 'Время последней проверки отзывов';
COMMENT ON COLUMN companies.telegram_notifications_enabled IS 'Включены ли уведомления в Telegram';

-- ============================================================
-- Шаг 4: Генерируем коды активации для существующих компаний
-- ============================================================

-- Функция для генерации уникального кода активации
CREATE OR REPLACE FUNCTION generate_activation_code() 
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Без похожих символов (I, O, 0, 1)
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Генерируем коды для существующих компаний (если их еще нет)
UPDATE companies 
SET telegram_activation_code = generate_activation_code()
WHERE telegram_activation_code IS NULL;

-- Проверяем уникальность (на случай коллизий)
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT telegram_activation_code, COUNT(*) as cnt
    FROM companies
    WHERE telegram_activation_code IS NOT NULL
    GROUP BY telegram_activation_code
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'Обнаружены дубликаты кодов активации! Запустите миграцию повторно.';
  END IF;
END $$;

-- ============================================================
-- Шаг 5: Мигрируем данные из старых полей (если они есть)
-- ============================================================

-- Если у компании был настроен telegram_chat_id, считаем бота активированным
UPDATE companies 
SET 
  telegram_activated = true,
  telegram_activated_at = NOW(),
  telegram_user_id = telegram_chat_id
WHERE telegram_chat_id IS NOT NULL 
  AND telegram_chat_id != ''
  AND telegram_activated IS NOT true;

-- ============================================================
-- Шаг 6: Создаем представление для мониторинга
-- ============================================================

-- Представление для просмотра статуса активации ботов
CREATE OR REPLACE VIEW telegram_activation_status AS
SELECT 
  c.id,
  c.company_name,
  c.telegram_activation_code,
  c.telegram_activated,
  c.telegram_user_id,
  c.telegram_username,
  c.telegram_activated_at,
  c.telegram_notifications_enabled,
  c.check_interval_minutes,
  c.min_rating_filter,
  c.max_rating_filter,
  c.last_check_at,
  c.active as company_active,
  u.email as user_email,
  u.name as user_name,
  CASE 
    WHEN c.telegram_activated THEN '✅ Активирован'
    WHEN c.telegram_activation_code IS NOT NULL THEN '⏳ Ожидает активации'
    ELSE '❌ Не настроен'
  END as status_display
FROM companies c
LEFT JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC;

COMMENT ON VIEW telegram_activation_status IS 'Статус активации Telegram ботов для всех компаний';

-- ============================================================
-- Шаг 7: Создаем функцию для проверки, каким компаниям пора проверять отзывы
-- ============================================================

CREATE OR REPLACE FUNCTION get_companies_to_check()
RETURNS TABLE (
  company_id UUID,
  company_name VARCHAR(255),
  two_gis_api_url TEXT,
  telegram_user_id VARCHAR(50),
  check_interval_minutes INTEGER,
  min_rating_filter INTEGER,
  max_rating_filter INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.company_name,
    c.two_gis_api_url,
    c.telegram_user_id,
    c.check_interval_minutes,
    c.min_rating_filter,
    c.max_rating_filter
  FROM companies c
  WHERE 
    c.active = true
    AND c.telegram_activated = true
    AND c.telegram_notifications_enabled = true
    AND c.telegram_user_id IS NOT NULL
    AND (
      c.last_check_at IS NULL 
      OR c.last_check_at < NOW() - (c.check_interval_minutes || ' minutes')::INTERVAL
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_companies_to_check() IS 'Возвращает список компаний, которым пора проверять новые отзывы';

-- ============================================================
-- Шаг 8: Выводим статистику миграции
-- ============================================================

DO $$
DECLARE
  total_companies INTEGER;
  activated_companies INTEGER;
  pending_companies INTEGER;
  with_codes INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_companies FROM companies;
  SELECT COUNT(*) INTO activated_companies FROM companies WHERE telegram_activated = true;
  SELECT COUNT(*) INTO pending_companies FROM companies WHERE telegram_activated = false AND telegram_activation_code IS NOT NULL;
  SELECT COUNT(*) INTO with_codes FROM companies WHERE telegram_activation_code IS NOT NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Миграция "Единый Telegram бот" завершена успешно!';
  RAISE NOTICE '============================================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Статистика:';
  RAISE NOTICE '   Всего компаний: %', total_companies;
  RAISE NOTICE '   Активированных ботов: %', activated_companies;
  RAISE NOTICE '   Ожидают активации: %', pending_companies;
  RAISE NOTICE '   Сгенерировано кодов: %', with_codes;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Добавлены поля:';
  RAISE NOTICE '   - two_gis_profile_url (ссылка на профиль)';
  RAISE NOTICE '   - telegram_activation_code (код активации)';
  RAISE NOTICE '   - telegram_user_id (ID пользователя Telegram)';
  RAISE NOTICE '   - telegram_username (username в Telegram)';
  RAISE NOTICE '   - telegram_activated (статус активации)';
  RAISE NOTICE '   - check_interval_minutes (интервал проверки)';
  RAISE NOTICE '   - min_rating_filter (фильтр по рейтингу)';
  RAISE NOTICE '   - max_rating_filter (фильтр по рейтингу)';
  RAISE NOTICE '   - last_check_at (время последней проверки)';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Создано:';
  RAISE NOTICE '   - 4 индекса для оптимизации';
  RAISE NOTICE '   - Представление telegram_activation_status';
  RAISE NOTICE '   - Функция get_companies_to_check()';
  RAISE NOTICE '   - Функция generate_activation_code()';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Примечание:';
  RAISE NOTICE '   Старые поля telegram_bot_token и telegram_chat_id';
  RAISE NOTICE '   оставлены для обратной совместимости.';
  RAISE NOTICE '   Их можно удалить после полного перехода на новую систему.';
  RAISE NOTICE '';
  RAISE NOTICE '============================================================';
  RAISE NOTICE '';
END $$;

-- ============================================================
-- Шаг 9: Примеры использования (закомментированы)
-- ============================================================

/*
-- Пример 1: Получить все компании, ожидающие активации
SELECT * FROM telegram_activation_status 
WHERE status_display = '⏳ Ожидает активации';

-- Пример 2: Получить компании, которым пора проверять отзывы
SELECT * FROM get_companies_to_check();

-- Пример 3: Активировать бота для компании
UPDATE companies 
SET 
  telegram_activated = true,
  telegram_activated_at = NOW(),
  telegram_user_id = '123456789',
  telegram_username = 'username'
WHERE telegram_activation_code = 'ABC12345';

-- Пример 4: Обновить время последней проверки
UPDATE companies 
SET last_check_at = NOW()
WHERE id = 'company-uuid-here';

-- Пример 5: Настроить фильтры для компании (только плохие отзывы 1-2 звезды)
UPDATE companies 
SET 
  min_rating_filter = 1,
  max_rating_filter = 2,
  check_interval_minutes = 10
WHERE id = 'company-uuid-here';

-- Пример 6: Отключить уведомления для компании
UPDATE companies 
SET telegram_notifications_enabled = false
WHERE id = 'company-uuid-here';
*/