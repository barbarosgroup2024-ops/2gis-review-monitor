# ⚡ Быстрый старт с Supabase (5 минут)

## 1️⃣ Создайте проект (2 минуты)

1. Откройте [supabase.com](https://supabase.com)
2. Войдите через GitHub
3. **New Project** → Заполните:
   - Name: `2gis-reviews`
   - Password: `придумайте надежный`
   - Region: `Europe (Frankfurt)`
4. **Create** → Подождите 2 минуты

---

## 2️⃣ Создайте таблицы (1 минута)

1. В Supabase откройте **SQL Editor**
2. **New query**
3. Скопируйте весь код из файла `database/schema.sql`
4. **Run** (Ctrl+Enter)
5. ✅ Готово! Таблицы созданы

---

## 3️⃣ Получите ключи (30 секунд)

1. **Settings** (⚙️) → **API**
2. Скопируйте 2 значения:

```
Project URL: https://xxxxx.supabase.co
service_role key: eyJhbGci...
```

---

## 4️⃣ Настройте .env (30 секунд)

Откройте файл `.env` и замените:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...

# Отключите Mock Mode
USE_MOCK_SHEETS=false
```

---

## 5️⃣ Запустите проект (1 минута)

```powershell
# Перезапустите сервер
npm run dev:full
```

Вы должны увидеть:

```
🚀 Используется Supabase (PostgreSQL)
🚀 Сервер запущен на порту 5000
```

---

## ✅ Проверка

1. Откройте http://localhost:3000
2. Зарегистрируйте нового пользователя
3. В Supabase: **Table Editor** → **users**
4. Вы должны увидеть нового пользователя! 🎉

---

## 🎯 Что дальше?

- Добавьте компанию с 2GIS API URL
- Настройте Telegram бота
- Получайте уведомления о новых отзывах!

---

## 🆘 Проблемы?

### "Invalid API key"

→ Проверьте `SUPABASE_SERVICE_KEY` в .env

### "relation does not exist"

→ Выполните SQL скрипт из `database/schema.sql`

### Сервер не запускается

→ Убедитесь, что `USE_MOCK_SHEETS=false`

---

## 📚 Подробная документация

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Полная инструкция
- **[MIGRATION_TO_SUPABASE.md](./MIGRATION_TO_SUPABASE.md)** - Руководство по миграции

---

**Готово за 5 минут! 🚀**
