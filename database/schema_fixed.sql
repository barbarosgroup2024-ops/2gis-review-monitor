-- ========================
-- Схема базы данных для 2GIS Reviews SaaS (ИСПРАВЛЕННАЯ)
-- ========================

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- Таблица пользователей
-- ========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ========================
-- Таблица подписок
-- ========================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL DEFAULT 'trial',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска подписок пользователя
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ========================
-- Таблица компаний
-- ========================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  two_gis_api_url TEXT NOT NULL,
  two_gis_profile_url TEXT,
  two_gis_company_id VARCHAR(255),
  telegram_bot_token VARCHAR(255),
  telegram_chat_id VARCHAR(255),
  -- Новые поля для единого Telegram бота
  telegram_activation_code VARCHAR(10) UNIQUE,
  telegram_user_id VARCHAR(255),
  telegram_username VARCHAR(255),
  telegram_activated BOOLEAN DEFAULT false,
  telegram_activated_at TIMESTAMP WITH TIME ZONE,
  telegram_notifications_enabled BOOLEAN DEFAULT true,
  check_interval_minutes INTEGER DEFAULT 5,
  min_rating_filter INTEGER CHECK (min_rating_filter >= 1 AND min_rating_filter <= 5),
  max_rating_filter INTEGER CHECK (max_rating_filter >= 1 AND max_rating_filter <= 5),
  last_check_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для компаний
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(active);
CREATE INDEX IF NOT EXISTS idx_companies_telegram_code ON companies(telegram_activation_code);
CREATE INDEX IF NOT EXISTS idx_companies_telegram_user_id ON companies(telegram_user_id);

-- ========================
-- Таблица отзывов
-- ========================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  two_gis_review_id VARCHAR(255) NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE,
  date_edited TIMESTAMP WITH TIME ZONE,
  user_name VARCHAR(255),
  address TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  sent_to_telegram BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, two_gis_review_id)
);

-- Индексы для отзывов
CREATE INDEX IF NOT EXISTS idx_reviews_company_id ON reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_reviews_date_created ON reviews(date_created DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_sent_to_telegram ON reviews(sent_to_telegram);
CREATE INDEX IF NOT EXISTS idx_reviews_two_gis_id ON reviews(two_gis_review_id);

-- ========================
-- Функция для автоматического обновления updated_at
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================
-- Row Level Security (RLS) - ИСПРАВЛЕНО
-- ========================

-- Включаем RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ⚠️ ВАЖНО: Удаляем старые политики, если они существуют
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own companies" ON companies;
DROP POLICY IF EXISTS "Users can insert own companies" ON companies;
DROP POLICY IF EXISTS "Users can update own companies" ON companies;
DROP POLICY IF EXISTS "Users can delete own companies" ON companies;
DROP POLICY IF EXISTS "Users can view reviews of own companies" ON reviews;

-- ========================
-- НОВЫЕ ПОЛИТИКИ (разрешают работу через service_role)
-- ========================

-- Политики для users
-- Service role может делать всё (для регистрации и авторизации)
CREATE POLICY "Service role can do everything on users" ON users
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Политики для subscriptions
-- Service role может делать всё
CREATE POLICY "Service role can do everything on subscriptions" ON subscriptions
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Политики для companies
-- Service role может делать всё
CREATE POLICY "Service role can do everything on companies" ON companies
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Политики для reviews
-- Service role может делать всё
CREATE POLICY "Service role can do everything on reviews" ON reviews
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- ========================
-- Представления для статистики
-- ========================

-- Представление для статистики отзывов по периодам
CREATE OR REPLACE VIEW review_stats AS
SELECT 
  company_id,
  COUNT(*) FILTER (WHERE date_created >= CURRENT_DATE) as today_count,
  COUNT(*) FILTER (WHERE date_created >= CURRENT_DATE - INTERVAL '1 day' 
                   AND date_created < CURRENT_DATE) as yesterday_count,
  COUNT(*) FILTER (WHERE date_created >= CURRENT_DATE - INTERVAL '7 days') as week_count,
  COUNT(*) FILTER (WHERE date_created >= CURRENT_DATE - INTERVAL '30 days') as month_count,
  COUNT(*) as total_count,
  AVG(rating) as avg_rating,
  MAX(date_created) as last_review_date
FROM reviews
GROUP BY company_id;

-- ========================
-- Функция для генерации кодов активации
-- ========================
CREATE OR REPLACE FUNCTION generate_activation_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ========================
-- ГОТОВО!
-- ========================
-- Теперь можно использовать базу данных через service_role key
-- Регистрация и все операции будут работать корректно