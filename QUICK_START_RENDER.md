# ⚡ Быстрый старт на Render.com (5 минут)

## 🎯 Что нужно сделать

1. **Создать аккаунт на Render**
2. **Подключить GitHub репозиторий**
3. **Добавить переменные окружения**
4. **Дождаться деплоя**
5. **Настроить Telegram webhook**

---

## 📝 Пошаговая инструкция

### 1️⃣ Создание аккаунта (1 минута)

1. Откройте: **https://render.com**
2. Нажмите **"Sign up with GitHub"**
3. Авторизуйте Render

### 2️⃣ Создание Web Service (2 минуты)

1. Нажмите **"New +"** → **"Web Service"**
2. Найдите репозиторий: **`2gis-review-monitor`**
3. Нажмите **"Connect"**

### 3️⃣ Настройка (2 минуты)

**Заполните форму:**

| Поле              | Значение                                                   |
| ----------------- | ---------------------------------------------------------- |
| **Name**          | `2gis-review-monitor`                                      |
| **Region**        | `Frankfurt (EU Central)`                                   |
| **Branch**        | `main`                                                     |
| **Runtime**       | `Node`                                                     |
| **Build Command** | `npm install && cd client && npm install && npm run build` |
| **Start Command** | `node server/index.js`                                     |
| **Plan**          | `Free`                                                     |

### 4️⃣ Переменные окружения (3 минуты)

Нажмите **"Add Environment Variable"** и добавьте:

```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=2gis_reviews_super_secret_key_change_this_12345678
SUPABASE_URL=https://fxjgmulnkiolxgsrfmry.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4amdtdWxua2lvbHhnc3JmbXJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY2MTEwNCwiZXhwIjoyMDc1MjM3MTA0fQ.EWbmp8Yb3BFPHKqxQqSzjX7lV7VPxrcM7U6bTBuk6jU
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4amdtdWxua2lvbHhnc3JmbXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjExMDQsImV4cCI6MjA3NTIzNzEwNH0.D0lQFJSaVOT8DZkAKtUyVupcFopCrovJC5QUMHn5vkc
TELEGRAM_BOT_TOKEN=8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM
ADMIN_TELEGRAM_BOT_TOKEN=8260305501:AAH5pKpgUcuU6XUzV0yZ4JYjeWaNtMccJYc
ADMIN_TELEGRAM_CHAT_ID=7737197594
FRONTEND_URL=https://your-app-name.onrender.com
REVIEW_CHECK_SCHEDULE=*/5 * * * *
GOOGLE_SHEETS_ENABLED=false
```

**💡 Совет:** Скопируйте все из файла `RENDER_ENV.txt`

### 5️⃣ Запуск деплоя (5-10 минут)

1. Нажмите **"Create Web Service"**
2. Дождитесь завершения сборки
3. Скопируйте ваш URL (например: `https://2gis-review-monitor.onrender.com`)

### 6️⃣ Обновление FRONTEND_URL (1 минута)

1. Перейдите в **"Environment"**
2. Найдите `FRONTEND_URL`
3. Замените на ваш реальный URL
4. Нажмите **"Save Changes"**

### 7️⃣ Настройка Telegram Webhook (1 минута)

Откройте в браузере (замените URL на ваш):

```
https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/setWebhook?url=https://ВАШ-URL.onrender.com/api/telegram/webhook
```

Должны увидеть: `{"ok":true,"result":true}`

---

## ✅ Проверка

### Проверьте API:

```
https://ваш-url.onrender.com/api/health
```

### Проверьте фронтенд:

```
https://ваш-url.onrender.com
```

### Проверьте бота:

1. Откройте: https://t.me/barbaros_2gis_bot
2. Отправьте `/start`

---

## 🎉 Готово!

Ваше приложение работает!

**Следующие шаги:**

1. Создайте аккаунт
2. Добавьте компанию
3. Активируйте бота

---

## 🆘 Если что-то не работает

Смотрите подробную инструкцию: **`RENDER_DEPLOYMENT.md`**

Или проверьте логи в Render Dashboard → Logs

---

## 📚 Полезные файлы

- `RENDER_DEPLOYMENT.md` - подробная инструкция
- `RENDER_ENV.txt` - все переменные окружения
- `render.yaml` - конфигурация для автоматического деплоя

---

**Время деплоя: ~15 минут**

**Стоимость: Бесплатно** (750 часов/месяц)
