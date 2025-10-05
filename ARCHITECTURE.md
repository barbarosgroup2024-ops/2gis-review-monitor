# Архитектура системы

## Обзор

Система представляет собой мультитенантное SaaS-решение для мониторинга отзывов с 2GIS с уведомлениями в Telegram.

## Технологический стек

### Backend

- **Node.js** - серверная платформа
- **Express** - веб-фреймворк
- **Google Sheets API** - хранение данных
- **node-cron** - планировщик задач
- **JWT** - аутентификация
- **bcryptjs** - хеширование паролей
- **axios** - HTTP клиент

### Frontend

- **React** - UI библиотека
- **React Router** - маршрутизация
- **Axios** - API клиент

### Внешние API

- **2GIS Reviews API** - получение отзывов
- **Telegram Bot API** - отправка уведомлений
- **Google Sheets API** - база данных

## Структура проекта

```
2-GIS/
├── server/                      # Backend
│   ├── index.js                # Точка входа
│   ├── routes/                 # API маршруты
│   │   ├── auth.js            # Аутентификация
│   │   ├── companies.js       # Управление компаниями
│   │   ├── reviews.js         # Отзывы
│   │   └── subscriptions.js   # Подписки
│   ├── controllers/            # Бизнес-логика
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── reviewController.js
│   │   └── subscriptionController.js
│   ├── services/               # Сервисы
│   │   ├── googleSheets.js    # Работа с Google Sheets
│   │   ├── twoGis.js          # Интеграция с 2GIS API
│   │   ├── telegram.js        # Telegram уведомления
│   │   └── reviewChecker.js   # Проверка новых отзывов
│   └── middleware/             # Middleware
│       └── auth.js            # JWT аутентификация
├── client/                     # Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   │   └── Header.js
│   │   ├── pages/             # Страницы
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Companies.js
│   │   │   ├── CompanyDetails.js
│   │   │   └── Profile.js
│   │   ├── services/          # API клиенты
│   │   │   ├── auth.js
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── credentials/                # Google API credentials (не в git)
│   └── google-credentials.json
├── .env                        # Переменные окружения (не в git)
├── .env.example               # Пример переменных окружения
├── .gitignore
├── package.json
├── README.md
├── SETUP_GUIDE.md
└── ARCHITECTURE.md
```

## Поток данных

### 1. Регистрация пользователя

```
User → Frontend → POST /api/auth/register → Backend
                                           ↓
                                    Hash password
                                           ↓
                                    Create user in Google Sheets
                                           ↓
                                    Create trial subscription
                                           ↓
                                    Generate JWT token
                                           ↓
Frontend ← Response with token ← Backend
```

### 2. Добавление компании

```
User → Frontend → POST /api/companies → Backend
                                       ↓
                                Check subscription
                                       ↓
                                Check company limit
                                       ↓
                                Create Google Sheet for company
                                       ↓
                                Save company to Master Sheet
                                       ↓
Frontend ← Company data ← Backend
```

### 3. Проверка отзывов (автоматически каждые 5 минут)

```
Cron Job (every 5 min)
    ↓
Get all active companies from Google Sheets
    ↓
For each company:
    ↓
    Fetch reviews from 2GIS API
    ↓
    Compare with existing reviews in Google Sheets
    ↓
    Filter new reviews
    ↓
    Save new reviews to company's Google Sheet
    ↓
    Update statistics (Today, Yesterday, Week, Month sheets)
    ↓
    Send Telegram notifications for new reviews
```

### 4. Просмотр отзывов

```
User → Frontend → GET /api/reviews/:companyId?period=today → Backend
                                                             ↓
                                                    Check permissions
                                                             ↓
                                                    Get reviews from Google Sheets
                                                             ↓
Frontend ← Reviews data ← Backend
```

## Модель данных

### Google Sheets структура

#### Master Spreadsheet

**Лист: Users**
| Поле | Тип | Описание |
|------|-----|----------|
| ID | String (UUID) | Уникальный идентификатор |
| Email | String | Email пользователя |
| Password | String (Hash) | Хешированный пароль |
| Name | String | Имя пользователя |
| Created | DateTime | Дата регистрации |
| Status | String | active/blocked |

**Лист: Subscriptions**
| Поле | Тип | Описание |
|------|-----|----------|
| UserID | String (UUID) | ID пользователя |
| Plan | String | trial/basic/premium |
| StartDate | DateTime | Дата начала |
| EndDate | DateTime | Дата окончания |
| Status | String | active/cancelled/expired |

**Лист: Companies**
| Поле | Тип | Описание |
|------|-----|----------|
| ID | String (UUID) | Уникальный идентификатор |
| UserID | String (UUID) | ID владельца |
| CompanyName | String | Название компании |
| TwoGisApiUrl | String | URL API 2GIS |
| TelegramBotToken | String | Токен Telegram бота |
| TelegramChatId | String | Chat ID для уведомлений |
| SheetId | String | ID Google Sheet компании |
| Active | Boolean | Активна ли проверка |
| Created | DateTime | Дата создания |

#### Company Spreadsheet (для каждой компании)

**Лист: 2GIS** (основной лист с отзывами)
| Поле | Тип | Описание |
|------|-----|----------|
| ID | String | ID отзыва из 2GIS |
| Дата | DateTime | Дата создания отзыва |
| Дата редактирования | DateTime | Дата редактирования |
| Имя | String | Имя пользователя |
| Адрес | String | Адрес филиала |
| Рейтинг | Number (1-5) | Оценка |
| Отзыв | String | Текст отзыва |

**Листы: Сегодня, Вчера, Неделя, Месяц**

- Та же структура, что и лист 2GIS
- Автоматически обновляются при проверке отзывов
- Содержат отфильтрованные данные по периодам

**Лист: Отправлено**

- Список ID отзывов, для которых уже отправлены уведомления
- Используется для предотвращения дублирования уведомлений

## API Endpoints

### Аутентификация

```
POST   /api/auth/register      - Регистрация
POST   /api/auth/login         - Вход
GET    /api/auth/me            - Получить текущего пользователя
PUT    /api/auth/profile       - Обновить профиль
```

### Компании

```
GET    /api/companies          - Список компаний пользователя
GET    /api/companies/:id      - Получить компанию
POST   /api/companies          - Создать компанию
PUT    /api/companies/:id      - Обновить компанию
DELETE /api/companies/:id      - Удалить компанию
POST   /api/companies/:id/test - Тестировать подключение к 2GIS
```

### Отзывы

```
GET    /api/reviews/:companyId              - Получить отзывы
GET    /api/reviews/:companyId/stats        - Статистика
POST   /api/reviews/:companyId/refresh      - Принудительно обновить
```

### Подписки

```
GET    /api/subscriptions/my               - Моя подписка
POST   /api/subscriptions/activate         - Активировать подписку
POST   /api/subscriptions/cancel           - Отменить подписку
```

## Безопасность

### Аутентификация

- JWT токены с истечением через 30 дней
- Пароли хешируются с помощью bcrypt (10 раундов)
- Токен передается в заголовке `Authorization: Bearer <token>`

### Авторизация

- Проверка прав доступа на уровне контроллеров
- Пользователь может видеть только свои компании и отзывы
- Middleware проверяет валидность токена для защищенных маршрутов

### Валидация

- Валидация входных данных на backend
- Проверка обязательных полей
- Проверка формата email, URL и т.д.

## Масштабирование

### Текущие ограничения

**Trial план:**

- 1 компания
- 7 дней

**Basic план:**

- 3 компании
- 30 дней

**Premium план:**

- 10 компаний
- 30 дней

### Оптимизация

1. **Кэширование**

   - Можно добавить Redis для кэширования часто запрашиваемых данных
   - Кэширование списка компаний и отзывов

2. **База данных**

   - Для большого количества пользователей рекомендуется переход на PostgreSQL/MongoDB
   - Google Sheets подходит для MVP и небольших проектов

3. **Очередь задач**

   - Для большого количества компаний можно использовать Bull/BullMQ
   - Распределение проверки отзывов по времени

4. **Мониторинг**
   - Добавить логирование (Winston, Pino)
   - Мониторинг ошибок (Sentry)
   - Метрики производительности

## Развитие

### Ближайшие улучшения

1. **Платежи**

   - Интеграция Stripe/ЮKassa
   - Автоматическое продление подписок
   - Управление тарифами

2. **Уведомления**

   - Email уведомления
   - Webhook для интеграции с другими системами
   - Настройка фильтров уведомлений (только негативные отзывы и т.д.)

3. **Аналитика**

   - Графики и диаграммы
   - Экспорт отчетов (PDF, Excel)
   - Сравнение периодов

4. **Интеграции**

   - Яндекс.Карты
   - Google Maps
   - Другие платформы отзывов

5. **Мобильное приложение**
   - React Native приложение
   - Push уведомления

## Деплой

### Рекомендуемые платформы

1. **Heroku** - простой деплой, бесплатный tier
2. **Railway** - современная альтернатива Heroku
3. **Render** - автоматический деплой из GitHub
4. **DigitalOcean App Platform** - больше контроля

### Переменные окружения для продакшн

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<strong-random-secret>
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-credentials.json
MASTER_SPREADSHEET_ID=<your-spreadsheet-id>
FRONTEND_URL=https://your-domain.com
REVIEW_CHECK_SCHEDULE=*/5 * * * *
```

### CI/CD

Можно настроить автоматический деплой через GitHub Actions:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

## Мониторинг и логирование

### Рекомендуемые инструменты

1. **Логирование**

   - Winston для структурированных логов
   - Логирование всех API запросов
   - Логирование ошибок с stack trace

2. **Мониторинг ошибок**

   - Sentry для отслеживания ошибок
   - Уведомления о критических ошибках

3. **Метрики**

   - Количество пользователей
   - Количество компаний
   - Количество проверок отзывов
   - Время ответа API

4. **Uptime мониторинг**
   - UptimeRobot
   - Pingdom
   - StatusCake

## Заключение

Система спроектирована как MVP с возможностью дальнейшего масштабирования. Использование Google Sheets в качестве базы данных упрощает начальную разработку, но для продакшн рекомендуется переход на полноценную СУБД при росте количества пользователей.
