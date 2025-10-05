-- Простая миграция: генерация кодов активации для существующих компаний

-- Функция для генерации уникального кода активации
CREATE OR REPLACE FUNCTION generate_activation_code() 
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Генерируем коды для всех компаний, у которых их еще нет
UPDATE companies 
SET telegram_activation_code = generate_activation_code()
WHERE telegram_activation_code IS NULL;

-- Показываем результат
SELECT 
  id,
  company_name,
  telegram_activation_code,
  telegram_activated
FROM companies
ORDER BY created_at DESC;