# 🚀 2GIS Reviews SaaS - Версия с Supabase

## ✨ Что нового?

Проект теперь поддерживает **Supabase (PostgreSQL)** в качестве базы данных!

### 🎯 Преимущества:

- ⚡ **В 10-100 раз быстрее** Google Sheets
- 📊 **Профессиональная БД** PostgreSQL
- 🔒 **Row Level Security** для безопасности
- 📈 **Масштабируемость** до миллионов записей
- 🆓 **Бесплатно** до 500MB

---

## 🚀 Быстрый старт (5 минут)

### 1. Создайте проект в Supabase

👉 [supabase.com](https://supabase.com) → New Project

### 2. Выполните SQL скрипт

1. Откройте **SQL Editor** в Supabase
2. Скопируйте содержимое `database/schema.sql`
3. Нажмите **Run**

### 3. Получите API ключи

**Settings** → **API** → Скопируйте:

- Project URL
- service_role key

### 4. Обновите .env

```env
SUPABASE_URL=https://ваш-проект.supabase.co
SUPABASE_SERVICE_KEY=ваш-service-role-key
USE_MOCK_SHEETS=false
```

### 5. Запустите проект

```powershell
npm run dev:full
```

✅ Готово! Откройте http://localhost:3000

---

## 📚 Документация

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Подробная инструкция по настройке
- **[MIGRATION_TO_SUPABASE.md](./MIGRATION_TO_SUPABASE.md)** - Руководство по миграции
- **[database/schema.sql](./database/schema.sql)** - SQL схема базы данных

---

## 🔄 Режимы работы

Проект поддерживает 3 режима:

### 1️⃣ Mock Mode (для разработки)

```env
USE_MOCK_SHEETS=true
```

Данные в памяти, без внешних зависимостей

### 2️⃣ Supabase (рекомендуется) ⭐

```env
USE_MOCK_SHEETS=false
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
```

PostgreSQL база данных, готово к продакшену

### 3️⃣ Google Sheets (legacy)

```env
USE_MOCK_SHEETS=false
# Без SUPABASE_URL
GOOGLE_SHEETS_CREDENTIALS_PATH=...
```

Старый режим для обратной совместимости

---

## 📊 Структура БД

```
users
├── id (UUID)
├── email
├── password
├── name
└── status

subscriptions
├── id (UUID)
├── user_id → users
├── plan
├── start_date
└── end_date

companies
├── id (UUID)
├── user_id → users
├── company_name
├── two_gis_api_url
├── telegram_bot_token
└── telegram_chat_id

reviews
├── id (UUID)
├── company_id → companies
├── two_gis_review_id
├── date_created
├── rating
└── review_text
```

---

## 🎯 Что дальше?

1. ✅ Зарегистрируйтесь на http://localhost:3000
2. ✅ Добавьте компанию с 2GIS API URL
3. ✅ Настройте Telegram бота
4. ✅ Получайте уведомления о новых отзывах!

---

## 🆘 Нужна помощь?

- **[FAQ.md](./FAQ.md)** - Частые вопросы
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Полная инструкция
- **[GitHub Issues](https://github.com/your-repo/issues)** - Сообщить о проблеме

---

**Сделано с ❤️ для мониторинга отзывов 2GIS**
