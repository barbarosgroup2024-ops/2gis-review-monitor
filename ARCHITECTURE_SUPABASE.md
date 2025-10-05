# 🏗️ Архитектура с Supabase

## 📊 Общая схема

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                      React (Port 3000)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │Companies │  │ Reviews  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                   Node.js + Express (Port 5000)              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Routes                             │  │
│  │  /api/auth  /api/companies  /api/reviews  /api/subs  │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                 Controllers                           │  │
│  │  authController  companyController  reviewController  │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Database Router                          │  │
│  │           (googleSheets.js)                           │  │
│  │                                                       │  │
│  │  if (USE_MOCK_SHEETS) → Mock                         │  │
│  │  else if (SUPABASE_URL) → Supabase                   │  │
│  │  else → Google Sheets                                │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│         ┌─────────────┼─────────────┐                       │
│         │             │             │                       │
│         ▼             ▼             ▼                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │   Mock   │  │ Supabase │  │  Google  │                 │
│  │  (RAM)   │  │ Service  │  │  Sheets  │                 │
│  └──────────┘  └────┬─────┘  └──────────┘                 │
│                     │                                        │
│  ┌──────────────────▼─────────────────────────────────┐   │
│  │              Other Services                         │   │
│  │  telegram.js  twoGis.js  reviewChecker.js          │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Supabase │  │ Telegram │  │  2GIS    │  │  Google  │   │
│  │PostgreSQL│  │   Bot    │  │   API    │  │  Sheets  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Структура базы данных Supabase

```
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Database                       │
│                        PostgreSQL                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                      users                            │  │
│  │  • id (UUID, PK)                                      │  │
│  │  • email (UNIQUE)                                     │  │
│  │  • password                                           │  │
│  │  • name                                               │  │
│  │  • status                                             │  │
│  │  • created_at, updated_at                             │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│         ┌─────────────┼─────────────┐                       │
│         │             │             │                       │
│         ▼             ▼             ▼                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │subscript.│  │companies │  │          │                 │
│  │• user_id │  │• user_id │  │          │                 │
│  │  (FK)    │  │  (FK)    │  │          │                 │
│  │• plan    │  │• name    │  │          │                 │
│  │• dates   │  │• 2gis_url│  │          │                 │
│  │• status  │  │• telegram│  │          │                 │
│  └──────────┘  └────┬─────┘  │          │                 │
│                     │         │          │                 │
│                     ▼         │          │                 │
│              ┌──────────┐     │          │                 │
│              │ reviews  │     │          │                 │
│              │• comp_id │     │          │                 │
│              │  (FK)    │     │          │                 │
│              │• 2gis_id │     │          │                 │
│              │• rating  │     │          │                 │
│              │• text    │     │          │                 │
│              │• sent    │     │          │                 │
│              └──────────┘     │          │                 │
│                               │          │                 │
│  ┌────────────────────────────▼──────────▼──────────────┐ │
│  │                    Indexes                            │ │
│  │  • idx_users_email                                    │ │
│  │  • idx_subscriptions_user_id                          │ │
│  │  • idx_companies_user_id                              │ │
│  │  • idx_reviews_company_id                             │ │
│  │  • idx_reviews_date_created                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Row Level Security (RLS)                  │ │
│  │  • Users see only their data                          │ │
│  │  • Companies filtered by user_id                      │ │
│  │  • Reviews filtered by company ownership              │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Поток данных

### 1. Регистрация пользователя

```
User → Frontend → POST /api/auth/register
                      ↓
                 authController.register()
                      ↓
                 bcrypt.hash(password)
                      ↓
                 googleSheetsService.createUser()
                      ↓
                 [Database Router]
                      ↓
                 supabase.createUser()
                      ↓
                 INSERT INTO users
                      ↓
                 googleSheetsService.createSubscription()
                      ↓
                 INSERT INTO subscriptions
                      ↓
                 jwt.sign(token)
                      ↓
                 Response → Frontend
```

### 2. Добавление компании

```
User → Frontend → POST /api/companies
                      ↓
                 auth middleware (verify JWT)
                      ↓
                 companyController.create()
                      ↓
                 googleSheetsService.createCompany()
                      ↓
                 [Database Router]
                      ↓
                 supabase.createCompany()
                      ↓
                 INSERT INTO companies
                      ↓
                 Response → Frontend
```

### 3. Проверка новых отзывов (Cron Job)

```
Cron (every 5 min) → reviewChecker.checkAllCompanies()
                           ↓
                    getAllActiveCompanies()
                           ↓
                    SELECT * FROM companies WHERE active=true
                           ↓
                    For each company:
                           ↓
                    twoGis.fetchReviews(apiUrl)
                           ↓
                    HTTP GET → 2GIS API
                           ↓
                    Parse reviews
                           ↓
                    For each new review:
                           ↓
                    saveReviewToSheet()
                           ↓
                    INSERT INTO reviews
                           ↓
                    telegram.sendNotification()
                           ↓
                    HTTP POST → Telegram API
                           ↓
                    markReviewAsSent()
                           ↓
                    UPDATE reviews SET sent_to_telegram=true
```

---

## 🔀 Выбор базы данных

### Логика выбора

```javascript
// server/services/googleSheets.js

if (process.env.USE_MOCK_SHEETS === "true") {
  // Режим 1: Mock (данные в памяти)
  console.log("🔧 Используется MOCK версия");
  module.exports = require("./googleSheets.mock");
} else if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  // Режим 2: Supabase (PostgreSQL)
  console.log("🚀 Используется Supabase (PostgreSQL)");
  module.exports = require("./supabase");
} else {
  // Режим 3: Google Sheets (legacy)
  console.log("📊 Используется Google Sheets API");
  // ... original Google Sheets code
}
```

### Приоритет выбора

```
1. USE_MOCK_SHEETS=true → Mock Mode
2. SUPABASE_URL + SUPABASE_SERVICE_KEY → Supabase
3. Default → Google Sheets
```

---

## 📦 Модульная архитектура

### Слои приложения

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (React Components)              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         API Layer                       │
│         (Express Routes)                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Business Logic Layer            │
│         (Controllers)                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Data Access Layer               │
│         (Services)                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    Database Abstraction         │   │
│  │    (googleSheets.js router)     │   │
│  └────────┬────────────────────────┘   │
│           │                             │
│  ┌────────┼────────┐                   │
│  │        │        │                   │
│  ▼        ▼        ▼                   │
│ Mock  Supabase  Google                 │
└─────────────────────────────────────────┘
```

### Преимущества

- ✅ **Разделение ответственности** - каждый слой делает свое
- ✅ **Легкая замена БД** - меняем только Data Access Layer
- ✅ **Тестируемость** - можем тестировать каждый слой отдельно
- ✅ **Масштабируемость** - легко добавлять новые функции

---

## 🔐 Безопасность

### Уровни защиты

```
┌─────────────────────────────────────────┐
│  Level 1: Frontend Validation           │
│  • Email format                         │
│  • Password strength                    │
│  • Required fields                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Level 2: JWT Authentication            │
│  • Token verification                   │
│  • Expiration check                     │
│  • User identification                  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Level 3: Backend Validation            │
│  • Input sanitization                   │
│  • Business rules                       │
│  • Authorization checks                 │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Level 4: Row Level Security (RLS)      │
│  • Database-level filtering             │
│  • User can see only their data         │
│  • Automatic by Supabase                │
└─────────────────────────────────────────┘
```

### RLS Policies

```sql
-- Users can view only their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can view only their companies
CREATE POLICY "Users can view own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view reviews of their companies
CREATE POLICY "Users can view reviews of own companies" ON reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = reviews.company_id
      AND companies.user_id = auth.uid()
    )
  );
```

---

## ⚡ Оптимизация производительности

### Индексы

```sql
-- Быстрый поиск пользователя по email
CREATE INDEX idx_users_email ON users(email);

-- Быстрый поиск компаний пользователя
CREATE INDEX idx_companies_user_id ON companies(user_id);

-- Быстрый поиск отзывов компании
CREATE INDEX idx_reviews_company_id ON reviews(company_id);

-- Сортировка отзывов по дате
CREATE INDEX idx_reviews_date_created ON reviews(date_created DESC);
```

### Views для статистики

```sql
-- Автоматическая статистика по компаниям
CREATE VIEW review_stats AS
SELECT
  company_id,
  COUNT(*) FILTER (WHERE date_created >= CURRENT_DATE) as today_count,
  COUNT(*) FILTER (WHERE date_created >= CURRENT_DATE - INTERVAL '7 days') as week_count,
  AVG(rating) as avg_rating
FROM reviews
GROUP BY company_id;
```

### Кэширование

```
┌─────────────────────────────────────────┐
│  Browser Cache                          │
│  • Static assets                        │
│  • API responses (short TTL)            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Supabase Cache                         │
│  • Query results                        │
│  • Automatic by PostgreSQL              │
└─────────────────────────────────────────┘
```

---

## 🔄 Масштабирование

### Горизонтальное масштабирование

```
┌─────────────────────────────────────────┐
│         Load Balancer                   │
└────────┬────────┬────────┬──────────────┘
         │        │        │
    ┌────▼───┐ ┌─▼────┐ ┌─▼────┐
    │Backend │ │Backend│ │Backend│
    │Node 1  │ │Node 2 │ │Node 3 │
    └────┬───┘ └──┬────┘ └──┬────┘
         │        │         │
         └────────┼─────────┘
                  │
         ┌────────▼────────┐
         │    Supabase     │
         │   (PostgreSQL)  │
         └─────────────────┘
```

### Вертикальное масштабирование

```
Free Tier → Pro → Team → Enterprise
500MB    → 8GB → 100GB → Custom
```

---

## 📊 Мониторинг

### Метрики

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
│                                         │
│  • Database size                        │
│  • API requests                         │
│  • Active connections                   │
│  • Query performance                    │
│  • Error logs                           │
└─────────────────────────────────────────┘
```

### Логирование

```javascript
// Backend logs
console.log("✅ Пользователь создан:", user.email);
console.log("🔄 Проверка новых отзывов...");
console.error("❌ Ошибка:", error.message);

// Supabase logs
// Автоматически в Dashboard → Logs
```

---

## 🎯 Будущие улучшения

### v2.1.0

- [ ] Supabase Realtime для live updates
- [ ] Supabase Auth вместо JWT
- [ ] Supabase Storage для файлов

### v2.2.0

- [ ] GraphQL API
- [ ] Webhooks
- [ ] Advanced analytics

---

**Архитектура готова к масштабированию! 🚀**
