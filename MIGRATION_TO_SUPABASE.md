# 🔄 Миграция с Google Sheets на Supabase

## ✅ Что было сделано

### 1. Установлены зависимости

```bash
npm install @supabase/supabase-js
```

### 2. Создана структура базы данных

- **Файл**: `database/schema.sql`
- **Таблицы**: users, subscriptions, companies, reviews
- **Индексы**: Для быстрого поиска
- **Триггеры**: Автоматическое обновление `updated_at`
- **RLS**: Row Level Security для безопасности

### 3. Создан сервис Supabase

- **Файл**: `server/services/supabase.js`
- **Совместимость**: Полная совместимость со старым API Google Sheets
- **Функции**: Все CRUD операции для users, subscriptions, companies, reviews

### 4. Обновлена конфигурация

- **Файл**: `.env`
- **Переменные**: SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY
- **Автовыбор**: Система автоматически выбирает Supabase, если настроены ключи

---

## 🚀 Быстрый старт

### Шаг 1: Создайте проект в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения создания (~2 минуты)

### Шаг 2: Выполните SQL скрипт

1. Откройте **SQL Editor** в Supabase
2. Скопируйте содержимое файла `database/schema.sql`
3. Вставьте и выполните (Run)

### Шаг 3: Получите API ключи

1. **Settings** → **API**
2. Скопируйте:
   - Project URL
   - anon public key
   - service_role key (⚠️ секретный!)

### Шаг 4: Обновите .env

```env
# Supabase Configuration
SUPABASE_URL=https://ваш-проект.supabase.co
SUPABASE_SERVICE_KEY=ваш-service-role-key
SUPABASE_ANON_KEY=ваш-anon-key

# Отключите Mock Mode
USE_MOCK_SHEETS=false
```

### Шаг 5: Перезапустите сервер

```powershell
npm run dev:full
```

Вы должны увидеть:

```
🚀 Используется Supabase (PostgreSQL)
```

---

## 📊 Структура базы данных

### Таблица: users

```sql
id              UUID PRIMARY KEY
email           VARCHAR(255) UNIQUE
password        VARCHAR(255)
name            VARCHAR(255)
status          VARCHAR(50)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Таблица: subscriptions

```sql
id              UUID PRIMARY KEY
user_id         UUID → users(id)
plan            VARCHAR(50)
start_date      TIMESTAMP
end_date        TIMESTAMP
status          VARCHAR(50)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Таблица: companies

```sql
id                  UUID PRIMARY KEY
user_id             UUID → users(id)
company_name        VARCHAR(255)
two_gis_api_url     TEXT
telegram_bot_token  VARCHAR(255)
telegram_chat_id    VARCHAR(255)
active              BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Таблица: reviews

```sql
id                  UUID PRIMARY KEY
company_id          UUID → companies(id)
two_gis_review_id   VARCHAR(255)
date_created        TIMESTAMP
date_edited         TIMESTAMP
user_name           VARCHAR(255)
address             TEXT
rating              INTEGER (1-5)
review_text         TEXT
sent_to_telegram    BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

## 🔄 Совместимость API

Все существующие контроллеры работают без изменений!

### Пример: Создание пользователя

**Старый код (Google Sheets):**

```javascript
await googleSheetsService.createUser({
  id: userId,
  email: "user@example.com",
  password: hashedPassword,
  name: "John Doe",
  created: new Date().toISOString(),
  status: "active",
});
```

**Новый код (Supabase):**

```javascript
// Тот же самый код работает!
await googleSheetsService.createUser({
  id: userId,
  email: "user@example.com",
  password: hashedPassword,
  name: "John Doe",
  created: new Date().toISOString(),
  status: "active",
});
```

Сервис Supabase автоматически преобразует данные в нужный формат.

---

## 🎯 Преимущества Supabase

### Производительность

- ⚡ **В 10-100 раз быстрее** Google Sheets
- 🔍 **Индексы** для быстрого поиска
- 📊 **SQL запросы** вместо API вызовов

### Масштабируемость

- 📈 **Миллионы записей** вместо 10,000
- 🔄 **Concurrent requests** без лимитов
- 💾 **500MB** на бесплатном плане

### Функциональность

- 🔗 **Foreign Keys** для связей между таблицами
- 🔒 **Row Level Security** для безопасности
- 📊 **Views** для сложных запросов
- ⚡ **Triggers** для автоматизации

### Удобство

- 🎨 **Table Editor** для просмотра данных
- 📝 **SQL Editor** для запросов
- 📊 **Dashboard** для мониторинга
- 🔍 **Logs** для отладки

---

## 🔧 Режимы работы

Система поддерживает 3 режима:

### 1. Mock Mode (для разработки)

```env
USE_MOCK_SHEETS=true
```

- Данные в памяти
- Без внешних зависимостей
- Быстрое тестирование

### 2. Supabase (рекомендуется)

```env
USE_MOCK_SHEETS=false
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
```

- PostgreSQL база данных
- Профессиональное решение
- Готово к продакшену

### 3. Google Sheets (legacy)

```env
USE_MOCK_SHEETS=false
# Не указывать SUPABASE_URL
GOOGLE_SHEETS_CREDENTIALS_PATH=...
MASTER_SPREADSHEET_ID=...
```

- Старый режим
- Для обратной совместимости

---

## 📈 Миграция данных

### Если у вас уже есть данные в Google Sheets:

#### Вариант 1: Ручной экспорт/импорт

1. **Экспорт из Google Sheets:**

   - File → Download → CSV
   - Сохраните каждый лист отдельно

2. **Импорт в Supabase:**
   - Table Editor → Insert → Import CSV
   - Выберите файл и сопоставьте колонки

#### Вариант 2: Скрипт миграции (TODO)

Создайте скрипт для автоматической миграции:

```javascript
// scripts/migrate-to-supabase.js
const googleSheets = require("./server/services/googleSheets");
const supabase = require("./server/services/supabase");

async function migrate() {
  // Получить данные из Google Sheets
  // Вставить в Supabase
}
```

---

## 🆘 Решение проблем

### Ошибка: "Invalid API key"

→ Проверьте SUPABASE_SERVICE_KEY в .env

### Ошибка: "relation does not exist"

→ Выполните SQL скрипт из database/schema.sql

### Ошибка: "permission denied"

→ Используйте service_role key, а не anon key

### Данные не сохраняются

→ Проверьте логи в Supabase Dashboard → Logs

### Сервер не запускается

→ Проверьте, что все переменные в .env заполнены

---

## 📚 Полезные ссылки

- [Полная инструкция по настройке](./SUPABASE_SETUP.md)
- [Документация Supabase](https://supabase.com/docs)
- [SQL Schema](./database/schema.sql)
- [Supabase Service](./server/services/supabase.js)

---

## ✅ Чеклист миграции

- [ ] Создан проект в Supabase
- [ ] Выполнен SQL скрипт (schema.sql)
- [ ] Получены API ключи
- [ ] Обновлен .env файл
- [ ] Сервер перезапущен
- [ ] Проверена регистрация нового пользователя
- [ ] Проверено создание компании
- [ ] Проверено сохранение отзывов
- [ ] (Опционально) Мигрированы старые данные

---

**Готово! Теперь ваш проект использует профессиональную базу данных! 🎉**
