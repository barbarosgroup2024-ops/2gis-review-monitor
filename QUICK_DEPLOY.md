# 🚀 Быстрый деплой на Railway

## ✅ Что уже готово

- ✅ Код на GitHub: https://github.com/barbarosgroup2024-ops/2gis-review-monitor
- ✅ Переменные окружения готовы в файле `RAILWAY_ENV.txt`
- ✅ Конфигурация Railway настроена

---

## 🎯 Что делать дальше (5 минут)

### 1️⃣ Создайте проект на Railway

1. Откройте https://railway.app
2. Login with GitHub
3. New Project → Deploy from GitHub repo
4. Выберите: `barbarosgroup2024-ops/2gis-review-monitor`
5. Deploy Now

### 2️⃣ Добавьте переменные окружения

1. Нажмите на сервис → Variables → Raw Editor
2. Откройте файл `RAILWAY_ENV.txt`
3. Скопируйте всё содержимое (без комментариев)
4. Вставьте в Railway
5. Save

### 3️⃣ Получите URL и настройте webhook

1. Settings → Domains → Generate Domain
2. Скопируйте URL (например: `https://abc123.up.railway.app`)
3. Обновите переменную `FRONTEND_URL` на этот URL
4. Откройте в браузере:
   ```
   https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/setWebhook?url=https://ВАШ-URL.up.railway.app/api/telegram/webhook
   ```
   (замените ВАШ-URL на реальный)

### 4️⃣ Проверьте работу

- API: `https://ваш-url.up.railway.app/api/health`
- Фронтенд: `https://ваш-url.up.railway.app`
- Telegram бот: отправьте `/start`

---

## 📋 Полная инструкция

Смотрите файл `DEPLOY_CHECKLIST.md` для детальных инструкций и troubleshooting.

---

## 🆘 Если что-то не работает

1. Проверьте логи: Railway → Deployments → View Logs
2. Проверьте переменные окружения
3. Убедитесь, что webhook настроен правильно

**Удачи! 🎉**
