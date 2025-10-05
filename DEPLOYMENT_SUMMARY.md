# 📦 Сводка подготовки к деплою

## ✅ Что сделано

### 1. Git и GitHub

- ✅ Git репозиторий инициализирован
- ✅ Код загружен на GitHub: https://github.com/barbarosgroup2024-ops/2gis-review-monitor
- ✅ `.gitignore` настроен правильно (`.env` не попадет в репозиторий)
- ✅ README обновлен с информацией о деплое

### 2. Конфигурация Railway

- ✅ `railway.json` создан с настройками сборки
- ✅ `package.json` обновлен для production сборки
- ✅ `server/index.js` настроен для раздачи статических файлов React

### 3. Переменные окружения

- ✅ Локальный `.env` файл очищен и структурирован
- ✅ `RAILWAY_ENV.txt` создан со всеми необходимыми переменными
- ✅ Все credentials готовы:
  - JWT_SECRET
  - SUPABASE_URL
  - SUPABASE_SERVICE_KEY
  - TELEGRAM_BOT_TOKEN
  - ADMIN_TELEGRAM_BOT_TOKEN

### 4. Документация

- ✅ `DEPLOY_CHECKLIST.md` - подробная инструкция по деплою
- ✅ `QUICK_DEPLOY.md` - быстрая инструкция (5 минут)
- ✅ `RAILWAY_DEPLOY.md` - оригинальная инструкция
- ✅ `RAILWAY_ENV.txt` - готовые переменные окружения

### 5. Код приложения

- ✅ Telegram бот с улучшенным логированием
- ✅ Поддержка единого бота для всех компаний
- ✅ Активация по уникальному коду
- ✅ Cron job для автоматической проверки отзывов
- ✅ API endpoints для фронтенда
- ✅ React фронтенд готов к production сборке

---

## 🎯 Следующие шаги

### Шаг 1: Деплой на Railway (5 минут)

1. **Откройте Railway**

   - Перейдите на https://railway.app
   - Login with GitHub

2. **Создайте проект**

   - New Project → Deploy from GitHub repo
   - Выберите: `barbarosgroup2024-ops/2gis-review-monitor`
   - Deploy Now

3. **Добавьте переменные окружения**

   - Откройте файл `RAILWAY_ENV.txt`
   - Скопируйте содержимое
   - В Railway: Variables → Raw Editor → Вставьте
   - Save

4. **Получите URL**

   - Settings → Domains → Generate Domain
   - Скопируйте URL (например: `https://abc123.up.railway.app`)

5. **Обновите FRONTEND_URL**
   - Variables → найдите `FRONTEND_URL`
   - Замените на ваш Railway URL
   - Save

### Шаг 2: Настройка Telegram Webhook

Откройте в браузере (замените ВАШ-URL):

```
https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/setWebhook?url=https://ВАШ-URL.up.railway.app/api/telegram/webhook
```

Должны увидеть: `{"ok":true,"result":true}`

### Шаг 3: Проверка работы

1. **API Health Check**

   ```
   https://ваш-url.up.railway.app/api/health
   ```

   Должно вернуть: `{"status":"ok"}`

2. **Фронтенд**

   ```
   https://ваш-url.up.railway.app
   ```

   Должна открыться страница входа

3. **Telegram бот**
   - Найдите бота в Telegram
   - Отправьте `/start`
   - Бот должен ответить

### Шаг 4: Тестирование

1. **Зарегистрируйтесь**

   - Откройте фронтенд
   - Создайте аккаунт
   - Войдите в систему

2. **Создайте компанию**

   - Добавьте ссылку на профиль 2GIS
   - Получите код активации

3. **Активируйте бота**

   - Откройте Telegram бота
   - Отправьте `/start КОД_АКТИВАЦИИ`
   - Проверьте, что бот активировался

4. **Проверьте отзывы**
   - Дождитесь следующего запуска cron (каждые 5 минут)
   - Проверьте, что отзывы приходят в Telegram

---

## 📊 Структура проекта

```
2gis-review-monitor/
├── 📄 README.md                    # Главная документация
├── 📄 QUICK_DEPLOY.md              # Быстрая инструкция (5 мин)
├── 📄 DEPLOY_CHECKLIST.md          # Подробная инструкция
├── 📄 RAILWAY_ENV.txt              # Переменные окружения
├── 📄 railway.json                 # Конфигурация Railway
├── 📄 package.json                 # Backend зависимости
├── 📁 server/                      # Backend код
│   ├── index.js                    # Точка входа
│   ├── routes/                     # API маршруты
│   ├── controllers/                # Контроллеры
│   ├── services/                   # Сервисы
│   │   ├── telegramBot.js          # Telegram бот
│   │   ├── reviewChecker.js        # Проверка отзывов
│   │   ├── twoGis.js               # 2GIS API
│   │   └── supabase.js             # Supabase клиент
│   └── middleware/                 # Middleware
├── 📁 client/                      # Frontend код
│   ├── package.json                # Frontend зависимости
│   ├── public/                     # Статические файлы
│   └── src/                        # React компоненты
└── 📁 database/                    # SQL миграции
    └── migrations/
        └── unified_telegram_bot.sql
```

---

## 🔑 Важные файлы

| Файл                             | Описание                                    |
| -------------------------------- | ------------------------------------------- |
| `QUICK_DEPLOY.md`                | Быстрая инструкция по деплою (5 минут)      |
| `DEPLOY_CHECKLIST.md`            | Подробная инструкция с troubleshooting      |
| `RAILWAY_ENV.txt`                | Готовые переменные окружения для Railway    |
| `railway.json`                   | Конфигурация сборки и деплоя                |
| `server/index.js`                | Точка входа backend с настройкой production |
| `server/services/telegramBot.js` | Telegram бот с улучшенным логированием      |

---

## 🔒 Безопасность

### ✅ Что защищено

- `.env` файл в `.gitignore` (не попадет в Git)
- Все секреты в переменных окружения Railway
- JWT для авторизации пользователей
- Supabase service key для доступа к БД

### ⚠️ Важно

- Никогда не коммитьте `.env` в Git
- Не делитесь токенами и ключами
- Регулярно проверяйте логи на подозрительную активность
- Используйте сильные пароли для пользователей

---

## 💰 Стоимость

### Railway

- **$5 бесплатно** каждый месяц (для новых пользователей)
- После этого: **~$5-10/месяц** для небольшого проекта
- Следите за использованием: Railway → Usage

### Supabase

- **Бесплатный план** включает:
  - 500 MB базы данных
  - 1 GB файлового хранилища
  - 2 GB bandwidth
- Этого достаточно для старта

### Telegram

- **Полностью бесплатно** 🎉

---

## 📞 Поддержка

### Если что-то не работает

1. **Проверьте логи**

   - Railway → Deployments → View Logs
   - Ищите ошибки с `ERROR` или `ECONNREFUSED`

2. **Проверьте переменные окружения**

   - Railway → Variables
   - Убедитесь, что все переменные добавлены

3. **Проверьте webhook**

   ```
   https://api.telegram.org/bot8002982567:AAHUinx3gTyIXCw1sFzVLIf78jvXJj1m8IM/getWebhookInfo
   ```

4. **Проверьте Supabase**
   - Откройте Supabase Dashboard
   - Проверьте, что таблицы созданы
   - Проверьте, что миграции выполнены

### Полезные ссылки

- **GitHub репозиторий**: https://github.com/barbarosgroup2024-ops/2gis-review-monitor
- **Railway Dashboard**: https://railway.app/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Telegram Bot API**: https://core.telegram.org/bots/api

---

## 🎉 Готово!

Ваш проект полностью готов к деплою на Railway!

**Следующий шаг:** Откройте `QUICK_DEPLOY.md` и следуйте инструкциям.

**Время деплоя:** ~5 минут

**Удачи! 🚀**
