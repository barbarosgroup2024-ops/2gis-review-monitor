-- Миграция: Добавление поля two_gis_company_id в таблицу companies
-- Дата: 2024
-- Описание: Добавляет отдельное поле для хранения ID компании из 2GIS

-- Добавляем новое поле
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS two_gis_company_id VARCHAR(50);

-- Создаем индекс для быстрого поиска по ID компании 2GIS
CREATE INDEX IF NOT EXISTS idx_companies_two_gis_id ON companies(two_gis_company_id);

-- Комментарий к полю
COMMENT ON COLUMN companies.two_gis_company_id IS 'ID компании из 2GIS (извлекается из URL API)';

-- Пытаемся извлечь ID из существующих URL
-- Формат URL: https://public-api.reviews.2gis.com/3.0/orgs/70000001024523370/reviews?...
UPDATE companies 
SET two_gis_company_id = (
  SELECT substring(two_gis_api_url FROM '/orgs/(\d+)')
)
WHERE two_gis_company_id IS NULL 
  AND two_gis_api_url ~ '/orgs/\d+';

-- Выводим результат миграции
DO $$
DECLARE
  total_companies INTEGER;
  updated_companies INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_companies FROM companies;
  SELECT COUNT(*) INTO updated_companies FROM companies WHERE two_gis_company_id IS NOT NULL;
  
  RAISE NOTICE 'Миграция завершена:';
  RAISE NOTICE '  Всего компаний: %', total_companies;
  RAISE NOTICE '  Обновлено ID: %', updated_companies;
  RAISE NOTICE '  Не обновлено: %', total_companies - updated_companies;
END $$;