# 🚀 Деплой на Render.com

## Почему Render?

- ✅ **Бесплатный тариф** - 750 часов в месяц (достаточно для одного проекта 24/7)
- ✅ **Автоматический деплой** из GitHub
- ✅ **Встроенный SSL** (HTTPS автоматически)
- ✅ **Простая настройка** - всё через веб-интерфейс
- ✅ **Автоматические перезапуски** при падении
- ✅ **Логи в реальном времени**

---

## 📋 Пошаговая инструкция (10 минут)

### Шаг 1: Создание аккаунта на Render

1. Откройте: https://render.com
2. Нажмите **"Get Started"** или **"Sign Up"**
3. Выберите **"Sign up with GitHub"**
4. Авторизуйте Render для доступа к вашим репозиториям

---

### Шаг 2: Создание Web Service

1. После входа нажмите **"New +"** → **"Web Service"**
2. Найдите репозиторий: **`2gis-review-monitor`**
3. Нажмите **"Connect"**

---

### Шаг 3: Настройка сервиса

Заполните форму:

#### **Basic Settings:**

- **Name:** `2gis-review-monitor` (или любое другое имя)
- **Region:** `Frankfurt (EU Central)` (ближе к России)
- **Branch:** `main`
- **Root Directory:** оставьте пустым
- **Runtime:** `Node`

#### **Build & Deploy:**

- **Build Command:**
  ```bash
  npm install && cd client && npm install && npm run build
  ```
- **Start Command:**
  ```bash
  node server/index.js
  ```

#### **Plan:**

- Выберите **"Free"** (750 часов/месяц)

---

### Шаг 4: Добавление переменных окружения

1. Прокрутите вниз до раздела **"Environment Variables"**
2. Нажмите **"Add Environment Variable"**
3. Добавьте следующие переменные:

```bash
NODE_ENV=production
PORT=10000

# JWT Secret
JWT_SECRET=2gis_reviews_super_secret_key_change_this_12345678

# Supabase Configuration
SUPABASE_URL=https://fxjgmulnkiolxgsrfmry.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4amdtdWxua2lvbHhnc3JmbXJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY2MTEwNCwiZXhwIjoyMDc1MjM3MTA0fQ.EWbmp8Yb3BFPHKqxQqSzjX7lV7VPxrcM7U6bTBuk6jU
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4amdtdWxua2lvbHhnc3JmbXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjExMDQsImV4cCI6MjA3NTIzNzEwNH0.D0lQFJSaVOT8DZkAKtUyVupcFopCrovJC5QUMHn5vkc

# Telegram Bot
TELEGRAM_BOT_TOKEN=8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM

# Admin Telegram Bot
ADMIN_TELEGRAM_BOT_TOKEN=8260305501:AAH5pKpgUcuU6XUzV0yZ4JYjeWaNtMccJYc
ADMIN_TELEGRAM_CHAT_ID=7737197594

# Frontend URL (обновите после получения URL)
FRONTEND_URL=https://your-app-name.onrender.com

# Cron Schedule
REVIEW_CHECK_SCHEDULE=*/5 * * * *

# Google Sheets (отключено)
GOOGLE_SHEETS_ENABLED=false
```

**⚠️ ВАЖНО:** Пока оставьте `FRONTEND_URL=https://your-app-name.onrender.com` - обновим после деплоя!

---

### Шаг 5: Запуск деплоя

1. Нажмите **"Create Web Service"** внизу страницы
2. Render начнёт сборку и деплой (займёт 5-10 минут)
3. Следите за логами в реальном времени

**Что происходит:**

- ✅ Клонирование репозитория
- ✅ Установка зависимостей (`npm install`)
- ✅ Сборка фронтенда (`npm run build`)
- ✅ Запуск сервера

---

### Шаг 6: Получение URL и обновление переменных

1. После успешного деплоя вы увидите URL вида:

   ```
   https://2gis-review-monitor.onrender.com
   ```

2. **Обновите переменную окружения:**
   - Перейдите в **"Environment"** (левое меню)
   - Найдите `FRONTEND_URL`
   - Измените на ваш реальный URL
   - Нажмите **"Save Changes"**
   - Render автоматически перезапустит сервис

---

### Шаг 7: Настройка Telegram Webhook

После обновления `FRONTEND_URL` настройте webhook для бота:

1. Откройте в браузере (замените на ваш URL):

   ```
   https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/setWebhook?url=https://2gis-review-monitor.onrender.com/api/telegram/webhook
   ```

2. Вы должны увидеть:

   ```json
   { "ok": true, "result": true, "description": "Webhook was set" }
   ```

3. Проверьте webhook:
   ```
   https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/getWebhookInfo
   ```

---

## ✅ Проверка работы

### 1. Проверка API

Откройте в браузере:

```
https://your-app-name.onrender.com/api/health
```

Должны увидеть:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Проверка фронтенда

Откройте:

```
https://your-app-name.onrender.com
```

Должна открыться страница входа.

### 3. Проверка Telegram бота

1. Откройте бота: https://t.me/barbaros_2gis_bot
2. Отправьте `/start`
3. Бот должен ответить

---

## 📊 Мониторинг

### Просмотр логов

1. Откройте ваш сервис на Render
2. Перейдите в **"Logs"** (левое меню)
3. Следите за логами в реальном времени

### Что искать в логах:

```
✅ Server running on port 10000
✅ Telegram bot started successfully
✅ Cron job scheduled
✅ Connected to Supabase
```

### Перезапуск сервиса

Если что-то пошло не так:

1. Нажмите **"Manual Deploy"** → **"Clear build cache & deploy"**

---

## 🆘 Troubleshooting

### Проблема: "Build failed"

**Решение:**

1. Проверьте логи сборки
2. Убедитесь, что `package.json` содержит все зависимости
3. Попробуйте **"Clear build cache & deploy"**

### Проблема: "Application failed to respond"

**Решение:**

1. Проверьте, что `PORT=10000` в переменных окружения
2. Убедитесь, что `server/index.js` использует `process.env.PORT`
3. Проверьте логи на наличие ошибок

### Проблема: Telegram бот не отвечает

**Решение:**

1. Проверьте, что webhook настроен правильно
2. Убедитесь, что `TELEGRAM_BOT_TOKEN` правильный
3. Проверьте логи на наличие ошибок от Telegram API

### Проблема: CORS ошибки

**Решение:**

1. Убедитесь, что `FRONTEND_URL` обновлён на правильный URL
2. Перезапустите сервис после изменения переменных

### Проблема: Сервис "засыпает" (бесплатный тариф)

**Особенность бесплатного тариа Render:**

- Сервис засыпает после 15 минут неактивности
- Первый запрос после "сна" может занять 30-60 секунд

**Решение:**

1. Обновите до платного тарифа ($7/месяц)
2. Или используйте внешний сервис для пинга (например, UptimeRobot)

---

## 💰 Стоимость

### Бесплатный тариф:

- ✅ 750 часов в месяц (достаточно для 1 проекта 24/7)
- ✅ Автоматический SSL
- ✅ Автоматические деплои
- ⚠️ Сервис засыпает после 15 минут неактивности
- ⚠️ Медленный старт после "сна" (30-60 секунд)

### Платный тариф (Starter - $7/месяц):

- ✅ Всегда активен (не засыпает)
- ✅ Быстрый старт
- ✅ Больше ресурсов (512 MB RAM)

---

## 🔒 Безопасность

### После деплоя:

1. ✅ Убедитесь, что `.env` файл не попал в Git
2. ✅ Смените `JWT_SECRET` на более сложный
3. ✅ Проверьте, что все переменные окружения добавлены
4. ✅ Настройте HTTPS (автоматически на Render)

---

## 📝 Чек-лист деплоя

- [ ] Создан аккаунт на Render
- [ ] Подключен GitHub репозиторий
- [ ] Настроены Build и Start команды
- [ ] Добавлены все переменные окружения
- [ ] Деплой завершён успешно
- [ ] Получен URL приложения
- [ ] Обновлена переменная `FRONTEND_URL`
- [ ] Настроен Telegram webhook
- [ ] Проверен API endpoint (`/api/health`)
- [ ] Проверен фронтенд (страница входа)
- [ ] Проверен Telegram бот (отправлен `/start`)
- [ ] Создан тестовый аккаунт
- [ ] Добавлена тестовая компания
- [ ] Активирован бот с кодом активации
- [ ] Проверены логи на наличие ошибок

---

## 🔗 Полезные ссылки

- **Render Dashboard:** https://dashboard.render.com
- **Render Docs:** https://render.com/docs
- **GitHub репозиторий:** https://github.com/barbarosgroup2024-ops/2gis-review-monitor
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Telegram Bot API:** https://core.telegram.org/bots/api

---

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет доступно по адресу:

```
https://your-app-name.onrender.com
```

**Следующие шаги:**

1. Создайте аккаунт в приложении
2. Добавьте компанию с ID из 2GIS
3. Получите код активации
4. Активируйте бота в Telegram
5. Дождитесь первых отзывов!

---

**Если возникнут проблемы - проверьте логи в Render Dashboard!**
