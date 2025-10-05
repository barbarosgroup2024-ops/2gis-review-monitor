# 📁 Структура проекта

## 🗂️ Обзор файловой структуры

```
2 GIS/
│
├── 📄 START_HERE.md              ⭐ НАЧНИТЕ ОТСЮДА!
├── 📄 CHECKLIST.md               ✅ Чеклист настройки
├── 📄 .env                       🔐 Конфигурация (ваши настройки)
├── 📄 .env.example               📋 Пример конфигурации
├── 📄 package.json               📦 Зависимости backend
│
├── 📂 credentials/               🔑 Google API ключи
│   ├── README.md                 📖 Инструкция по настройке
│   └── google-credentials.json   🔐 JSON ключ (создайте сами)
│
├── 📂 server/                    🖥️ Backend (Node.js + Express)
│   ├── index.js                  🚀 Главный файл сервера
│   │
│   ├── 📂 controllers/           🎮 Контроллеры (бизнес-логика)
│   │   ├── authController.js     👤 Аутентификация
│   │   ├── companyController.js  🏢 Управление компаниями
│   │   ├── reviewController.js   ⭐ Управление отзывами
│   │   └── subscriptionController.js 💳 Управление подписками
│   │
│   ├── 📂 services/              ⚙️ Сервисы (интеграции)
│   │   ├── googleSheets.js       📊 Работа с Google Sheets
│   │   ├── twoGis.js             🗺️ Интеграция с 2GIS API
│   │   ├── telegram.js           📱 Отправка в Telegram
│   │   └── reviewChecker.js      🔄 Автоматическая проверка отзывов
│   │
│   ├── 📂 middleware/            🛡️ Middleware
│   │   └── auth.js               🔐 JWT аутентификация
│   │
│   └── 📂 routes/                🛣️ API маршруты
│       ├── auth.js               /api/auth/*
│       ├── companies.js          /api/companies/*
│       ├── reviews.js            /api/reviews/*
│       └── subscriptions.js      /api/subscriptions/*
│
├── 📂 client/                    💻 Frontend (React)
│   ├── package.json              📦 Зависимости frontend
│   │
│   ├── 📂 public/                🌐 Статические файлы
│   │   └── index.html            📄 HTML шаблон
│   │
│   └── 📂 src/                   ⚛️ React приложение
│       ├── index.js              🚀 Точка входа
│       ├── index.css             🎨 Глобальные стили
│       ├── App.js                📱 Главный компонент
│       │
│       ├── 📂 pages/             📄 Страницы
│       │   ├── Login.js          🔐 Страница входа
│       │   ├── Register.js       📝 Страница регистрации
│       │   ├── Dashboard.js      📊 Главная панель
│       │   ├── Companies.js      🏢 Список компаний
│       │   ├── CompanyDetails.js 📋 Детали компании
│       │   └── Profile.js        👤 Профиль пользователя
│       │
│       ├── 📂 components/        🧩 Компоненты
│       │   └── Header.js         🎯 Шапка сайта
│       │
│       └── 📂 services/          🔌 API клиенты
│           ├── api.js            🌐 HTTP клиент (axios)
│           └── auth.js           🔐 Управление токенами
│
└── 📂 docs/                      📚 Документация
    ├── README.md                 📖 Основная документация
    ├── QUICKSTART.md             ⚡ Быстрый старт (15 мин)
    ├── SETUP_GUIDE.md            📘 Детальная настройка
    ├── ARCHITECTURE.md           🏗️ Архитектура системы
    ├── API_EXAMPLES.md           💡 Примеры API запросов
    ├── DEPLOYMENT.md             🚀 Деплой на продакшн
    ├── FAQ.md                    ❓ Частые вопросы
    ├── DIAGRAMS.md               📊 Диаграммы системы
    ├── TODO.md                   📝 Планы развития
    ├── CHANGELOG.md              📜 История изменений
    ├── CONTRIBUTING.md           🤝 Гайд для разработчиков
    └── PROJECT_SUMMARY.md        📋 Краткое описание
```

---

## 🔄 Поток данных

```
┌─────────────┐
│  Пользователь │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  React Frontend  │  http://localhost:3000
│  (client/)       │
└────────┬────────┘
         │ HTTP/REST API
         ▼
┌─────────────────┐
│  Express Backend │  http://localhost:5000
│  (server/)       │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────┐
│ Google  │ │ 2GIS API │
│ Sheets  │ │          │
└─────────┘ └──────────┘
    │
    ▼
┌─────────────┐
│  Telegram   │
│  Bot API    │
└─────────────┘
```

---

## 🗄️ Структура данных в Google Sheets

### Master Spreadsheet (главная таблица)

```
📊 2GIS Reviews Master
│
├── 📄 Users
│   └── ID | Email | Password | Name | Created | Status
│
├── 📄 Subscriptions
│   └── UserID | Plan | StartDate | EndDate | Status
│
└── 📄 Companies
    └── ID | UserID | CompanyName | TwoGisApiUrl | TelegramBotToken |
        TelegramChatId | SheetId | Active | Created
```

### Company Spreadsheet (для каждой компании)

```
📊 [Название компании] - Reviews
│
├── 📄 Reviews (все отзывы)
│   └── ID | Дата | Дата редактирования | Пользователь | Адрес | Рейтинг | Отзыв
│
├── 📄 Сегодня (отзывы за сегодня)
│   └── [те же колонки]
│
├── 📄 Вчера (отзывы за вчера)
│   └── [те же колонки]
│
├── 📄 Неделя (отзывы за неделю)
│   └── [те же колонки]
│
└── 📄 Месяц (отзывы за месяц)
    └── [те же колонки]
```

---

## 🔐 Безопасность

### Файлы с секретами (НЕ коммитить в Git!)

```
❌ .env                           # Переменные окружения
❌ credentials/google-credentials.json  # Google API ключ
❌ node_modules/                  # Зависимости
```

### Защищенные данные

- ✅ Пароли хешируются с bcrypt (10 раундов)
- ✅ JWT токены для аутентификации (30 дней)
- ✅ Telegram токены хранятся в Google Sheets (доступ только через Service Account)
- ✅ Каждый пользователь видит только свои компании

---

## 🚀 Команды для работы

### Разработка

```bash
# Установка зависимостей
npm install                    # Backend
cd client && npm install       # Frontend

# Запуск в режиме разработки
npm run dev                    # Только backend (порт 5000)
npm run client                 # Только frontend (порт 3000)
npm run dev:full               # Оба сервера одновременно

# Сборка для продакшн
npm run build                  # Собрать React приложение
npm start                      # Запустить в продакшн режиме
```

### Тестирование

```bash
npm test                       # Запустить тесты (когда будут добавлены)
```

---

## 📡 API Endpoints

### Аутентификация (`/api/auth`)

```
POST   /api/auth/register      # Регистрация
POST   /api/auth/login         # Вход
GET    /api/auth/me            # Текущий пользователь
```

### Компании (`/api/companies`)

```
GET    /api/companies          # Список компаний пользователя
POST   /api/companies          # Добавить компанию
GET    /api/companies/:id      # Получить компанию
PUT    /api/companies/:id      # Обновить компанию
DELETE /api/companies/:id      # Удалить компанию
```

### Отзывы (`/api/reviews`)

```
GET    /api/reviews/:companyId           # Отзывы компании
GET    /api/reviews/:companyId/stats     # Статистика
POST   /api/reviews/:companyId/refresh   # Обновить отзывы
```

### Подписки (`/api/subscriptions`)

```
GET    /api/subscriptions/my             # Моя подписка
POST   /api/subscriptions/activate       # Активировать подписку
```

---

## 🔄 Автоматические процессы

### Cron Job (каждые 5 минут)

```javascript
// server/services/reviewChecker.js

1. Получить все активные компании
2. Для каждой компании:
   - Запросить отзывы из 2GIS API
   - Сравнить с существующими в Google Sheets
   - Сохранить новые отзывы
   - Обновить статистику (Сегодня, Вчера, Неделя, Месяц)
   - Отправить уведомления в Telegram
```

---

## 🎯 Ключевые особенности

### Мультитенантность

- ✅ Каждый пользователь имеет свой аккаунт
- ✅ Каждая компания имеет свою Google Sheets таблицу
- ✅ Полная изоляция данных между пользователями
- ✅ Персональные Telegram уведомления

### Масштабируемость

- ✅ Модульная архитектура (легко добавлять функции)
- ✅ Разделение на слои (controllers → services → data)
- ✅ Готовность к миграции на PostgreSQL/MongoDB
- ✅ Документированные API endpoints

### Автоматизация

- ✅ Автоматическая проверка отзывов (cron)
- ✅ Автоматическое создание таблиц для компаний
- ✅ Автоматическая генерация статистики
- ✅ Автоматические Telegram уведомления

---

## 📚 Документация

### Для начала работы

1. **START_HERE.md** - начните с этого файла
2. **CHECKLIST.md** - пошаговый чеклист настройки
3. **QUICKSTART.md** - быстрый старт за 15 минут

### Для разработчиков

1. **ARCHITECTURE.md** - архитектура системы
2. **API_EXAMPLES.md** - примеры работы с API
3. **CONTRIBUTING.md** - гайд для контрибьюторов

### Для деплоя

1. **DEPLOYMENT.md** - инструкции по деплою
2. **FAQ.md** - решение частых проблем

---

## 🎉 Готово к использованию!

Проект полностью настроен и готов к запуску. Следуйте инструкциям в **START_HERE.md** для начала работы!
