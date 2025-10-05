# 🔧 Обновление переменных окружения на Render

## Проблема

После исправления кода нужно убедиться, что на Render настроены правильные переменные окружения.

---

## ✅ Шаги для обновления

### 1. Откройте Render Dashboard

1. Перейдите: **https://dashboard.render.com**
2. Войдите в аккаунт
3. Выберите ваш Web Service: **twogis-review-monitor**

### 2. Откройте Environment

1. В левом меню нажмите **"Environment"**
2. Проверьте наличие следующих переменных:

### 3. Обязательные переменные

Убедитесь, что есть эти переменные:

```
NODE_ENV=production
PORT=10000

# JWT Secret
JWT_SECRET=2gis_reviews_super_secret_key_change_this_12345678

# Supabase Configuration
SUPABASE_URL=https://fxjgmulnkiolxgsrfmry.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4amdtdWxua2lvbHhnc3JmbXJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY2MTEwNCwiZXhwIjoyMDc1MjM3MTA0fQ.EWbmp8Yb3BFPHKqxQqSzjX7lV7VPxrcM7U6bTBuk6jU

# Telegram Bot
TELEGRAM_BOT_TOKEN=8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM
ENABLE_TELEGRAM_BOT=true

# Frontend URL
FRONTEND_URL=https://twogis-review-monitor.onrender.com

# Cron Schedule
REVIEW_CHECK_SCHEDULE=*/5 * * * *

# Google Sheets (отключено)
GOOGLE_SHEETS_ENABLED=false
USE_MOCK_SHEETS=false
```

### 4. Важно!

**ENABLE_TELEGRAM_BOT** должна быть:

- ✅ **`true`** на Render (production)
- ❌ **`false`** локально (development)

Это предотвращает конфликт 409 Telegram.

### 5. Сохраните изменения

1. Нажмите **"Save Changes"**
2. Render автоматически перезапустит сервис
3. Дождитесь завершения деплоя (2-3 минуты)

---

## 🧪 Проверка после обновления

### 1. Проверьте логи

1. Откройте вкладку **"Logs"**
2. Вы должны увидеть:
   ```
   🚀 Используется Supabase (PostgreSQL)
   🤖 Telegram бот запущен и ожидает команд...
   Server running on port 10000
   ```

### 2. Проверьте регистрацию

1. Откройте https://twogis-review-monitor.onrender.com/register
2. Зарегистрируйтесь:
   - **Имя:** Test User
   - **Email:** test@example.com
   - **Пароль:** 123456
3. Если успешно - проблема решена! ✅

### 3. Проверьте логин

1. Откройте https://twogis-review-monitor.onrender.com/login
2. Войдите с теми же данными
3. Если успешно - всё работает! 🎉

---

## ❌ Если всё ещё не работает

### Проверьте логи на наличие ошибок:

1. **`supabase.from is not a function`** - код не обновился, нужно сделать git push
2. **`SUPABASE_URL или SUPABASE_SERVICE_KEY не настроены`** - проверьте переменные окружения
3. **`Telegram polling error: 409 Conflict`** - убедитесь, что локальный сервер остановлен

### Принудительный редеплой

Если код не обновился:

1. В Render Dashboard → вкладка **"Manual Deploy"**
2. Нажмите **"Deploy latest commit"**
3. Дождитесь завершения

---

## 📚 Дополнительная информация

- **Supabase Setup:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Quick Fix:** [FIX_REGISTRATION.md](./FIX_REGISTRATION.md)
- **Deployment Guide:** [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)

---

## ✅ Чек-лист

- [ ] Открыл Render Dashboard
- [ ] Проверил переменные окружения
- [ ] Убедился, что ENABLE_TELEGRAM_BOT=true
- [ ] Сохранил изменения
- [ ] Дождался перезапуска сервиса
- [ ] Проверил логи (нет ошибок)
- [ ] Проверил регистрацию (работает)
- [ ] Проверил логин (работает)

---

**После этого всё должно работать!** 🎉
