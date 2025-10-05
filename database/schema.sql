-- ========================
-- Схема базы данных для 2GIS Reviews SaaS
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
  telegram_bot_token VARCHAR(255),
  telegram_chat_id VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для компаний
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(active);

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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================
-- Row Level Security (RLS)
-- ========================

-- Включаем RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Политики для users (пользователи видят только свои данные)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Политики для subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Политики для companies
CREATE POLICY "Users can view own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies" ON companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies" ON companies
  FOR DELETE USING (auth.uid() = user_id);

-- Политики для reviews
CREATE POLICY "Users can view reviews of own companies" ON reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = reviews.company_id 
      AND companies.user_id = auth.uid()
    )
  );

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
-- Тестовые данные (опционально)
-- ========================

-- Раскомментируйте для добавления тестовых данных
/*
INSERT INTO users (email, password, name) VALUES 
  ('test@example.com', '$2a$10$example_hashed_password', 'Test User');

INSERT INTO subscriptions (user_id, plan, end_date) VALUES 
  ((SELECT id FROM users WHERE email = 'test@example.com'), 'trial', NOW() + INTERVAL '7 days');
*/