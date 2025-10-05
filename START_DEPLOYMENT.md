# 🚀 НАЧНИТЕ ДЕПЛОЙ ЗДЕСЬ

## 📦 Всё готово к деплою!

Ваш проект полностью подготовлен и загружен на GitHub.

**GitHub репозиторий:** https://github.com/barbarosgroup2024-ops/2gis-review-monitor

---

## ⚡ Быстрый старт (5 минут)

### 1️⃣ Откройте Railway

Перейдите на: **https://railway.app**

- Нажмите **"Login"**
- Выберите **"Login with GitHub"**
- Авторизуйте Railway

### 2️⃣ Создайте проект

- Нажмите **"New Project"**
- Выберите **"Deploy from GitHub repo"**
- Найдите: **`barbarosgroup2024-ops/2gis-review-monitor`**
- Нажмите **"Deploy Now"**

⏳ Railway начнет сборку (3-5 минут). Первая сборка может упасть - это нормально.

### 3️⃣ Добавьте переменные окружения

1. Откройте файл **`RAILWAY_ENV.txt`** в этой папке
2. Скопируйте ВСЁ содержимое (кроме комментариев)
3. В Railway:
   - Нажмите на ваш сервис
   - Вкладка **"Variables"**
   - Нажмите **"Raw Editor"**
   - Вставьте скопированное
   - Нажмите **"Save"** или **"Update Variables"**

Railway автоматически перезапустит сервис.

### 4️⃣ Получите URL приложения

1. В Railway перейдите на вкладку **"Settings"**
2. Найдите секцию **"Domains"**
3. Нажмите **"Generate Domain"**
4. Скопируйте URL (например: `https://abc123.up.railway.app`)

### 5️⃣ Обновите FRONTEND_URL

1. Вернитесь на вкладку **"Variables"**
2. Найдите переменную `FRONTEND_URL`
3. Замените значение на ваш Railway URL
4. Сохраните

### 6️⃣ Настройте Telegram Webhook

Откройте в браузере (замените `ВАШ-URL` на реальный):

```
https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/setWebhook?url=https://ВАШ-URL.up.railway.app/api/telegram/webhook
```

Должны увидеть: `{"ok":true,"result":true,"description":"Webhook was set"}`

---

## ✅ Проверка работы

### API Health Check

Откройте: `https://ваш-url.up.railway.app/api/health`

Должно вернуть:

```json
{ "status": "ok", "timestamp": "..." }
```

### Фронтенд

Откройте: `https://ваш-url.up.railway.app`

Должна открыться страница входа/регистрации.

### Telegram бот

1. Найдите вашего бота в Telegram
2. Отправьте `/start`
3. Бот должен ответить приветственным сообщением

---

## 🎯 Тестирование

### 1. Создайте аккаунт

- Откройте фронтенд
- Зарегистрируйтесь
- Войдите в систему

### 2. Добавьте компанию

- Вставьте ссылку на профиль 2GIS
- Система сгенерирует код активации
- Скопируйте код

### 3. Активируйте бота

- Откройте Telegram бота
- Отправьте: `/start ВАШ_КОД`
- Бот должен подтвердить активацию

### 4. Проверьте отзывы

- Дождитесь следующего запуска cron (каждые 5 минут)
- Новые отзывы должны приходить в Telegram

---

## 📊 Мониторинг

### Логи Railway

1. Railway → Deployments
2. Нажмите на последний деплой
3. View Logs

**Что искать:**

- ✅ `Server running on port 3000`
- ✅ `Telegram bot started successfully`
- ✅ `Review checker cron job started`
- ❌ Любые ошибки с `ERROR`

### Проверка webhook

```
https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/getWebhookInfo
```

Должно показать ваш webhook URL.

---

## 🆘 Если что-то не работает

### Сборка падает

1. Проверьте логи сборки в Railway
2. Убедитесь, что все переменные окружения добавлены
3. Проверьте, что `NODE_ENV=production`

### Бот не отвечает

1. Проверьте webhook: `/getWebhookInfo`
2. Проверьте логи Railway на ошибки
3. Убедитесь, что `TELEGRAM_BOT_TOKEN` правильный

### Фронтенд не открывается

1. Проверьте логи: должно быть `Client build completed`
2. Проверьте, что сборка прошла успешно
3. Попробуйте очистить кеш браузера

### API возвращает 500

1. Проверьте логи Railway
2. Убедитесь, что Supabase credentials правильные
3. Проверьте подключение к базе данных

---

## 📚 Дополнительная документация

- **Быстрая инструкция:** `QUICK_DEPLOY.md`
- **Подробная инструкция:** `DEPLOY_CHECKLIST.md`
- **Полная сводка:** `DEPLOYMENT_SUMMARY.md`
- **Переменные окружения:** `RAILWAY_ENV.txt`

---

## 💡 Полезные ссылки

- **GitHub:** https://github.com/barbarosgroup2024-ops/2gis-review-monitor
- **Railway:** https://railway.app/dashboard
- **Supabase:** https://supabase.com/dashboard
- **Telegram Bot API:** https://core.telegram.org/bots/api

---

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет работать в production!

**Время деплоя:** ~5-10 минут

**Удачи! 🚀**

---

## 📝 Чек-лист

- [ ] Railway аккаунт создан
- [ ] Проект создан из GitHub репозитория
- [ ] Переменные окружения добавлены
- [ ] Domain сгенерирован
- [ ] FRONTEND_URL обновлен
- [ ] Telegram webhook настроен
- [ ] API health check работает
- [ ] Фронтенд открывается
- [ ] Telegram бот отвечает
- [ ] Тестовый аккаунт создан
- [ ] Компания добавлена
- [ ] Бот активирован
- [ ] Отзывы приходят в Telegram

**Когда все пункты отмечены - деплой завершен! 🎊**
