# 📝 Шпаргалка по проекту

## ⚡ Быстрые команды

### Проверка и запуск

```powershell
# Проверить готовность
.\check-setup.ps1

# Запустить проект (интерактивно)
.\start.ps1

# Запустить оба сервера
npm run dev:full

# Только backend
npm run dev

# Только frontend
npm run client

# Сборка для продакшн
npm run build
```

---

## 🌐 URL адреса

```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
API Docs:  http://localhost:5000/api
```

---

## 📁 Важные файлы

### Конфигурация

```
.env                                    # Настройки проекта
credentials/google-credentials.json    # Google API ключи
```

### Backend

```
server/index.js                         # Главный файл
server/services/reviewChecker.js        # Проверка отзывов
server/services/telegram.js             # Telegram уведомления
server/services/twoGis.js                # 2GIS API
server/services/googleSheets.js          # Google Sheets
```

### Frontend

```
client/src/App.js                       # Главный компонент
client/src/pages/Dashboard.js           # Дашборд
client/src/pages/Login.js               # Вход
client/src/pages/Register.js            # Регистрация
```

---

## 🔑 Переменные окружения (.env)

```env
# Порты
PORT=5000
CLIENT_PORT=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Sheets
MASTER_SPREADSHEET_ID=ВСТАВЬТЕ_ID_ВАШЕЙ_ТАБЛИЦЫ
GOOGLE_CREDENTIALS_PATH=./credentials/google-credentials.json

# Telegram (по умолчанию)
DEFAULT_TELEGRAM_TOKEN=8260305501:AAH5pKpgUcuU6XUzV0yZ4JYjeWaNtMccJYc
DEFAULT_TELEGRAM_CHAT_ID=7737197594

# 2GIS API
TWO_GIS_API_BASE_URL=https://public-api.reviews.2gis.com/3.0

# Cron
REVIEW_CHECK_INTERVAL=300000  # 5 минут в миллисекундах
```

---

## 📊 API Endpoints

### Аутентификация

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Компании

```http
GET    /api/companies
POST   /api/companies
GET    /api/companies/:id
PUT    /api/companies/:id
DELETE /api/companies/:id
```

### Отзывы

```http
GET /api/reviews/:companyId
GET /api/reviews/:companyId/stats
```

### Подписки

```http
GET  /api/subscriptions
POST /api/subscriptions/upgrade
```

---

## 🗄️ Структура Google Sheets

### Master таблица

#### Лист "Users"

```
id | email | password | name | createdAt
```

#### Лист "Subscriptions"

```
id | userId | plan | status | startDate | endDate | maxCompanies
```

#### Лист "Companies"

```
id | userId | name | twoGisUrl | twoGisApiKey | telegramChatId | spreadsheetId | isActive | createdAt
```

### Таблица компании

#### Лист "2GIS"

```
ID | Дата | Дата редактирования | Пользователь | Адрес | Рейтинг | Отзыв
```

#### Листы "Сегодня", "Вчера", "Неделя", "Месяц"

```
Источник | Дата | Имя | Адрес | Рейтинг | Отзыв | id
```

#### Лист "Отправлено"

```
review_id
```

---

## 🔄 Жизненный цикл отзыва

```
1. Cron Job (каждые 5 минут)
   ↓
2. Запрос к 2GIS API
   ↓
3. Сравнение с существующими отзывами
   ↓
4. Если есть новые:
   ├── Сохранение в Google Sheets (лист "2GIS")
   ├── Обновление статистики (листы "Сегодня", "Вчера", и т.д.)
   ├── Отправка в Telegram
   └── Сохранение ID в лист "Отправлено"
```

---

## 💳 Планы подписок

```javascript
TRIAL: {
  duration: 7 дней,
  maxCompanies: 1,
  price: 0
}

BASIC: {
  duration: 30 дней,
  maxCompanies: 3,
  price: 990 руб
}

PREMIUM: {
  duration: 30 дней,
  maxCompanies: 10,
  price: 2990 руб
}
```

---

## 🐛 Отладка

### Логи

```powershell
# Backend логи
npm run dev

# Frontend логи
npm run client

# Оба сразу
npm run dev:full
```

### Проверка зависимостей

```powershell
# Backend
npm list

# Frontend
cd client
npm list
```

### Проверка портов

```powershell
# Проверить, занят ли порт 5000
netstat -ano | findstr :5000

# Проверить, занят ли порт 3000
netstat -ano | findstr :3000
```

---

## 📱 Telegram Bot

### Получить Chat ID

1. Напишите боту `/start`
2. Откройте: `https://api.telegram.org/bot{TOKEN}/getUpdates`
3. Найдите `"chat":{"id":123456789}`

### Формат уведомления

```
📌 Источник: 2GIS
📅 Дата: пн 15 янв 2024
👤 Имя: Иван Иванов
📍 Адрес: ул. Ленина, 1
⭐️ Рейтинг: 5
📝 Отзыв:
Отличный сервис!
```

---

## 🔗 2GIS API

### Получить org_id

Из URL компании:

```
https://2gis.ru/moscow/firm/70000001024523370
                            ↑
                         org_id
```

### Получить API ключ

1. Откройте DevTools (F12)
2. Перейдите на страницу компании в 2GIS
3. Вкладка Network → найдите запрос к `reviews.2gis.com`
4. Скопируйте параметр `key=...`

### Пример запроса

```
GET https://public-api.reviews.2gis.com/3.0/orgs/{org_id}/reviews
  ?limit=50
  &key={api_key}
  &locale=ru_KG
```

---

## 🛠️ Частые проблемы

### Ошибка: "Cannot find module"

```powershell
# Переустановить зависимости
npm install
cd client
npm install
```

### Ошибка: "Port already in use"

```powershell
# Найти процесс
netstat -ano | findstr :5000

# Убить процесс (замените PID)
taskkill /PID 12345 /F
```

### Ошибка: "Google Sheets API"

1. Проверьте `credentials/google-credentials.json`
2. Убедитесь, что Service Account имеет доступ к таблице
3. Проверьте `MASTER_SPREADSHEET_ID` в `.env`

### Ошибка: "Telegram не отправляет"

1. Убедитесь, что написали боту первое сообщение
2. Проверьте `TELEGRAM_TOKEN` и `TELEGRAM_CHAT_ID`
3. Проверьте, что бот не заблокирован

---

## 📚 Документация

### Быстрый старт

```
README_FIRST.md  → NEXT_STEPS.md → START_HERE.md → CHECKLIST.md
```

### Понимание системы

```
HOW_IT_WORKS.md → PROJECT_MAP.md → ARCHITECTURE.md
```

### Разработка

```
CONTRIBUTING.md → API_EXAMPLES.md → TODO.md
```

### Деплой

```
DEPLOYMENT.md → FAQ.md
```

---

## 🎯 Полезные ссылки

### Внешние API

- 2GIS API: `https://public-api.reviews.2gis.com/3.0`
- Telegram Bot API: `https://api.telegram.org/bot{TOKEN}`
- Google Sheets API: `https://sheets.googleapis.com/v4`

### Документация

- Node.js: https://nodejs.org/docs
- React: https://react.dev
- Express: https://expressjs.com
- Google Sheets API: https://developers.google.com/sheets/api

---

## 💡 Советы

### Разработка

- Используйте `npm run dev:full` для одновременного запуска
- Проверяйте логи в консоли
- Используйте Postman для тестирования API

### Продакшн

- Измените `JWT_SECRET` на случайную строку
- Используйте HTTPS
- Настройте мониторинг логов
- Регулярно делайте бэкапы Google Sheets

### Безопасность

- Никогда не коммитьте `.env` в Git
- Храните `google-credentials.json` в безопасности
- Используйте сильные пароли
- Регулярно обновляйте зависимости

---

## 🚀 Быстрый старт (копипаста)

```powershell
# 1. Проверка
.\check-setup.ps1

# 2. Если всё ОК - запуск
.\start.ps1

# 3. Откройте браузер
start http://localhost:3000
```

---

## 📞 Помощь

Если что-то не работает:

1. `.\check-setup.ps1` - диагностика
2. `FAQ.md` - частые вопросы
3. `DOCUMENTATION_INDEX.md` - все документы

---

**Версия**: 1.0.0  
**Обновлено**: 2024
