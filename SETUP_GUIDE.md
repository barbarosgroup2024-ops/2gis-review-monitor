# Руководство по установке и настройке

## Шаг 1: Установка зависимостей

### Backend

```powershell
# Установка зависимостей сервера
npm install
```

### Frontend

```powershell
# Переход в папку клиента
cd client

# Установка зависимостей
npm install

# Возврат в корневую папку
cd ..
```

## Шаг 2: Настройка Google Sheets API

### 2.1 Создание проекта в Google Cloud

1. Перейдите на https://console.cloud.google.com/
2. Создайте новый проект (например, "2GIS Reviews Monitor")
3. Выберите созданный проект

### 2.2 Включение Google Sheets API

1. В меню слева выберите "APIs & Services" → "Library"
2. Найдите "Google Sheets API"
3. Нажмите "Enable"

### 2.3 Создание Service Account

1. Перейдите в "APIs & Services" → "Credentials"
2. Нажмите "Create Credentials" → "Service Account"
3. Заполните:
   - Service account name: `2gis-reviews-bot`
   - Service account ID: автоматически
   - Нажмите "Create and Continue"
4. Пропустите опциональные шаги (Grant access, Grant users access)
5. Нажмите "Done"

### 2.4 Создание ключа

1. Найдите созданный Service Account в списке
2. Нажмите на него
3. Перейдите на вкладку "Keys"
4. Нажмите "Add Key" → "Create new key"
5. Выберите тип "JSON"
6. Нажмите "Create"
7. Файл автоматически скачается

### 2.5 Сохранение ключа

1. Создайте папку `credentials` в корне проекта:

   ```powershell
   New-Item -ItemType Directory -Path "credentials"
   ```

2. Переместите скачанный JSON файл в папку `credentials`
3. Переименуйте его в `google-credentials.json`

## Шаг 3: Создание мастер-таблицы Google Sheets

### 3.1 Создание таблицы

1. Перейдите на https://sheets.google.com/
2. Создайте новую таблицу
3. Назовите её "2GIS Reviews Master"

### 3.2 Создание листов

Создайте следующие листы (вкладки):

#### Лист 1: Users

Заголовки (строка 1):

```
ID | Email | Password | Name | Created | Status
```

#### Лист 2: Subscriptions

Заголовки (строка 1):

```
UserID | Plan | StartDate | EndDate | Status
```

#### Лист 3: Companies

Заголовки (строка 1):

```
ID | UserID | CompanyName | TwoGisApiUrl | TelegramBotToken | TelegramChatId | SheetId | Active | Created
```

### 3.3 Предоставление доступа Service Account

1. Откройте файл `credentials/google-credentials.json`
2. Найдите поле `client_email` (например: `2gis-reviews-bot@project-id.iam.gserviceaccount.com`)
3. Скопируйте этот email
4. В Google Sheets нажмите "Поделиться" (Share)
5. Вставьте скопированный email
6. Выберите роль "Редактор" (Editor)
7. Снимите галочку "Уведомить пользователей"
8. Нажмите "Поделиться"

### 3.4 Получение ID таблицы

1. Откройте вашу таблицу в браузере
2. Скопируйте ID из URL:
   ```
   https://docs.google.com/spreadsheets/d/[ВОТ_ЭТОТ_ID]/edit
   ```
3. Сохраните этот ID - он понадобится в следующем шаге

## Шаг 4: Настройка переменных окружения

1. Скопируйте файл `.env.example` в `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Откройте `.env` в текстовом редакторе

3. Заполните переменные:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (замените на случайную строку)
JWT_SECRET=ваш_супер_секретный_ключ_минимум_32_символа

# Google Sheets API
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-credentials.json
MASTER_SPREADSHEET_ID=ваш_id_таблицы_из_шага_3.4

# Telegram Bot (опционально, для админских уведомлений)
ADMIN_TELEGRAM_BOT_TOKEN=
ADMIN_TELEGRAM_CHAT_ID=

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cron Schedule (каждые 5 минут)
REVIEW_CHECK_SCHEDULE=*/5 * * * *
```

## Шаг 5: Запуск приложения

### Режим разработки (рекомендуется для тестирования)

Запустите backend и frontend одновременно:

```powershell
npm run dev:full
```

Или раздельно в разных терминалах:

**Терминал 1 - Backend:**

```powershell
npm run dev
```

**Терминал 2 - Frontend:**

```powershell
npm run client
```

### Доступ к приложению

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Шаг 6: Первый запуск

### 6.1 Регистрация

1. Откройте http://localhost:3000
2. Нажмите "Зарегистрироваться"
3. Заполните форму:
   - Имя
   - Email
   - Пароль (минимум 6 символов)
4. Нажмите "Зарегистрироваться"

После регистрации вы автоматически получите:

- 7 дней пробного периода
- Возможность добавить 1 компанию

### 6.2 Добавление компании

1. Перейдите в раздел "Компании"
2. Нажмите "Добавить компанию"
3. Заполните форму:
   - **Название компании**: Любое название
   - **URL API 2GIS**: Ссылка на API вашей компании
   - **Telegram Bot Token**: (опционально) Токен вашего бота
   - **Telegram Chat ID**: (опционально) Ваш Chat ID

### 6.3 Получение ссылки 2GIS API

Ссылка должна иметь формат:

```
https://public-api.reviews.2gis.com/3.0/orgs/[ID_ОРГАНИЗАЦИИ]/reviews?limit=50&key=[API_KEY]&locale=ru_KG
```

Где:

- `[ID_ОРГАНИЗАЦИИ]` - ID вашей организации в 2GIS
- `[API_KEY]` - Ваш API ключ 2GIS

### 6.4 Настройка Telegram бота (опционально)

#### Создание бота:

1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте команду `/newbot`
4. Следуйте инструкциям
5. Скопируйте полученный токен (формат: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

#### Получение Chat ID:

1. Найдите @userinfobot в Telegram
2. Отправьте ему любое сообщение
3. Скопируйте ваш ID (число, например: `123456789`)

#### Добавление в систему:

1. Вставьте токен бота в поле "Telegram Bot Token"
2. Вставьте ваш Chat ID в поле "Telegram Chat ID"
3. Сохраните компанию

### 6.5 Тестирование

1. После сохранения компании нажмите "Тестировать подключение"
2. Если всё настроено правильно, вы увидите сообщение об успехе
3. Система начнёт автоматически проверять отзывы каждые 5 минут

## Шаг 7: Проверка работы

### 7.1 Проверка логов

В терминале с backend вы должны видеть:

```
🚀 Сервер запущен на порту 5000
📅 Проверка отзывов по расписанию: */5 * * * *
🌍 Окружение: development
```

Каждые 5 минут:

```
🔄 Запуск проверки новых отзывов...
Найдено X активных компаний
Проверка отзывов для: [Название компании]
✅ Проверка завершена
```

### 7.2 Проверка Google Sheets

1. Откройте мастер-таблицу
2. Проверьте лист "Users" - должна быть ваша запись
3. Проверьте лист "Subscriptions" - должна быть ваша подписка
4. Проверьте лист "Companies" - должна быть ваша компания

### 7.3 Проверка отзывов

1. В личном кабинете перейдите к компании
2. Нажмите "🔄 Обновить"
3. Если есть отзывы, они появятся в списке
4. Если настроен Telegram, вы получите уведомления

## Возможные проблемы и решения

### Ошибка: "Cannot find module 'googleapis'"

**Решение:**

```powershell
npm install
```

### Ошибка: "ENOENT: no such file or directory, open './credentials/google-credentials.json'"

**Решение:**

1. Проверьте, что файл `google-credentials.json` находится в папке `credentials`
2. Проверьте путь в `.env` файле

### Ошибка: "The caller does not have permission"

**Решение:**

1. Убедитесь, что вы предоставили доступ Service Account к таблице
2. Проверьте, что email из `client_email` добавлен в "Поделиться"

### Ошибка: "Unable to parse range: Users!A2:F"

**Решение:**

1. Убедитесь, что лист называется точно "Users" (с заглавной буквы)
2. Проверьте, что в первой строке есть заголовки

### Отзывы не приходят в Telegram

**Решение:**

1. Проверьте токен бота
2. Проверьте Chat ID
3. Убедитесь, что вы написали боту первое сообщение (нажмите "Start")
4. Проверьте, что компания активна (галочка "Активна")

## Продакшн деплой

Для деплоя в продакшн рекомендуется использовать:

- **Heroku**: https://heroku.com
- **Railway**: https://railway.app
- **Render**: https://render.com
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform

### Пример деплоя на Heroku:

```powershell
# Установка Heroku CLI
# Скачайте с https://devcenter.heroku.com/articles/heroku-cli

# Вход в Heroku
heroku login

# Создание приложения
heroku create your-app-name

# Установка переменных окружения
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MASTER_SPREADSHEET_ID=your_spreadsheet_id
heroku config:set NODE_ENV=production

# Загрузка credentials (через Heroku Dashboard)
# Settings → Config Vars → добавьте содержимое google-credentials.json

# Деплой
git push heroku main
```

## Поддержка

Если у вас возникли проблемы:

1. Проверьте логи в терминале
2. Проверьте консоль браузера (F12)
3. Убедитесь, что все шаги выполнены правильно
4. Проверьте, что все зависимости установлены

## Следующие шаги

После успешной настройки вы можете:

1. Добавить больше компаний (в зависимости от тарифа)
2. Настроить интеграцию с платежной системой
3. Добавить email уведомления
4. Расширить функционал статистики
5. Добавить экспорт отчетов

Удачи! 🚀
