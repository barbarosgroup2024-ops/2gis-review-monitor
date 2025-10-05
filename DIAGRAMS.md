# Диаграммы системы

Визуальное представление архитектуры и процессов системы.

## Общая архитектура

```mermaid
graph TB
    subgraph "Frontend"
        A[React App]
        A1[Login/Register]
        A2[Dashboard]
        A3[Companies]
        A4[Reviews]
    end

    subgraph "Backend"
        B[Express Server]
        B1[Auth Routes]
        B2[Company Routes]
        B3[Review Routes]
        B4[Subscription Routes]
        C[Controllers]
        D[Services]
        E[Middleware]
    end

    subgraph "External Services"
        F[Google Sheets API]
        G[2GIS API]
        H[Telegram Bot API]
    end

    subgraph "Automation"
        I[Cron Job]
    end

    A --> B
    B --> C
    C --> D
    D --> F
    D --> G
    D --> H
    I --> D
    E --> B
```

## Поток регистрации пользователя

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant G as Google Sheets

    U->>F: Заполняет форму регистрации
    F->>B: POST /api/auth/register
    B->>B: Валидация данных
    B->>B: Хеширование пароля
    B->>G: Создание пользователя
    B->>G: Создание trial подписки
    B->>B: Генерация JWT токена
    B->>F: Возврат токена и данных
    F->>F: Сохранение токена
    F->>U: Перенаправление на Dashboard
```

## Поток добавления компании

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant G as Google Sheets

    U->>F: Заполняет форму компании
    F->>B: POST /api/companies
    B->>B: Проверка подписки
    B->>B: Проверка лимита компаний
    B->>G: Создание новой таблицы
    G->>B: Возврат Sheet ID
    B->>G: Сохранение компании в Master Sheet
    B->>F: Возврат данных компании
    F->>U: Показ успешного сообщения
```

## Процесс проверки отзывов

```mermaid
flowchart TD
    A[Cron Job каждые 5 минут] --> B[Получить активные компании]
    B --> C{Есть компании?}
    C -->|Нет| Z[Завершить]
    C -->|Да| D[Для каждой компании]
    D --> E[Запрос к 2GIS API]
    E --> F{Успешно?}
    F -->|Нет| G[Логировать ошибку]
    G --> D
    F -->|Да| H[Получить существующие отзывы]
    H --> I[Сравнить с новыми]
    I --> J{Есть новые?}
    J -->|Нет| D
    J -->|Да| K[Сохранить в Google Sheets]
    K --> L[Обновить статистику]
    L --> M{Telegram настроен?}
    M -->|Нет| D
    M -->|Да| N[Отправить уведомления]
    N --> D
    D --> Z
```

## Структура данных в Google Sheets

```mermaid
erDiagram
    USERS ||--o{ SUBSCRIPTIONS : has
    USERS ||--o{ COMPANIES : owns
    COMPANIES ||--|| COMPANY_SHEET : has

    USERS {
        string id PK
        string email
        string password
        string name
        datetime created
        string status
    }

    SUBSCRIPTIONS {
        string userId FK
        string plan
        datetime startDate
        datetime endDate
        string status
    }

    COMPANIES {
        string id PK
        string userId FK
        string companyName
        string twoGisApiUrl
        string telegramBotToken
        string telegramChatId
        string sheetId
        boolean active
        datetime created
    }

    COMPANY_SHEET {
        string id PK
        datetime date
        datetime dateEdited
        string userName
        string address
        int rating
        string text
    }
```

## API Endpoints

```mermaid
graph LR
    A[API /api] --> B[/auth]
    A --> C[/companies]
    A --> D[/reviews]
    A --> E[/subscriptions]

    B --> B1[POST /register]
    B --> B2[POST /login]
    B --> B3[GET /me]
    B --> B4[PUT /profile]

    C --> C1[GET /]
    C --> C2[GET /:id]
    C --> C3[POST /]
    C --> C4[PUT /:id]
    C --> C5[DELETE /:id]
    C --> C6[POST /:id/test]

    D --> D1[GET /:companyId]
    D --> D2[GET /:companyId/stats]
    D --> D3[POST /:companyId/refresh]

    E --> E1[GET /my]
    E --> E2[POST /activate]
    E --> E3[POST /cancel]
```

## Жизненный цикл отзыва

```mermaid
stateDiagram-v2
    [*] --> New: Отзыв создан в 2GIS
    New --> Fetched: Получен через API
    Fetched --> Compared: Сравнение с существующими
    Compared --> Saved: Сохранен в Google Sheets
    Saved --> Notified: Отправлено уведомление
    Notified --> [*]

    Compared --> Duplicate: Уже существует
    Duplicate --> [*]
```

## Система аутентификации

```mermaid
flowchart TD
    A[Пользователь] --> B{Есть токен?}
    B -->|Нет| C[Страница входа]
    C --> D[Ввод email/password]
    D --> E[POST /api/auth/login]
    E --> F{Валидный?}
    F -->|Нет| G[Ошибка]
    G --> C
    F -->|Да| H[Получить JWT токен]
    H --> I[Сохранить в localStorage]
    I --> J[Перенаправление на Dashboard]

    B -->|Да| K{Токен валидный?}
    K -->|Нет| C
    K -->|Да| J

    J --> L[Защищенные страницы]
    L --> M[Каждый запрос с токеном]
    M --> N[Middleware проверяет токен]
    N --> O{Валидный?}
    O -->|Нет| P[401 Unauthorized]
    P --> C
    O -->|Да| Q[Доступ разрешен]
```

## Процесс обновления статистики

```mermaid
flowchart LR
    A[Все отзывы] --> B[Фильтр по дате]
    B --> C[Сегодня]
    B --> D[Вчера]
    B --> E[Неделя]
    B --> F[Месяц]

    C --> G[Обновить лист 'Сегодня']
    D --> H[Обновить лист 'Вчера']
    E --> I[Обновить лист 'Неделя']
    F --> J[Обновить лист 'Месяц']

    G --> K[Статистика готова]
    H --> K
    I --> K
    J --> K
```

## Интеграция с Telegram

```mermaid
sequenceDiagram
    participant S as System
    participant T as Telegram API
    participant U as User

    S->>S: Новый отзыв обнаружен
    S->>S: Форматирование сообщения
    S->>T: POST /sendMessage
    T->>T: Валидация токена
    T->>T: Проверка chat_id
    T->>U: Доставка сообщения
    U->>U: Получение уведомления
    T->>S: Подтверждение доставки
```

## Компоненты Frontend

```mermaid
graph TD
    A[App.js] --> B[Router]
    B --> C[Header]
    B --> D[Login]
    B --> E[Register]
    B --> F[Dashboard]
    B --> G[Companies]
    B --> H[CompanyDetails]
    B --> I[Profile]

    F --> J[Stats Grid]
    F --> K[Quick Start]

    G --> L[Company List]
    G --> M[Add Company Button]

    H --> N[Company Form]
    H --> O[Stats]
    H --> P[Reviews List]

    C --> Q[Navigation]
    C --> R[Logout Button]
```

## Процесс деплоя

```mermaid
flowchart TD
    A[Разработка] --> B[Git Commit]
    B --> C[Git Push]
    C --> D{CI/CD?}
    D -->|Да| E[GitHub Actions]
    E --> F[Run Tests]
    F --> G{Тесты прошли?}
    G -->|Нет| H[Уведомление об ошибке]
    H --> A
    G -->|Да| I[Build Frontend]
    I --> J[Deploy to Heroku/Railway]
    J --> K[Health Check]
    K --> L{Успешно?}
    L -->|Нет| M[Rollback]
    M --> A
    L -->|Да| N[Продакшн]

    D -->|Нет| O[Ручной деплой]
    O --> I
```

## Масштабирование системы

```mermaid
graph TB
    subgraph "Текущая архитектура"
        A1[Single Server]
        A2[Google Sheets]
    end

    subgraph "Будущая архитектура"
        B1[Load Balancer]
        B2[Server 1]
        B3[Server 2]
        B4[Server N]
        B5[PostgreSQL]
        B6[Redis Cache]
        B7[Message Queue]

        B1 --> B2
        B1 --> B3
        B1 --> B4
        B2 --> B5
        B3 --> B5
        B4 --> B5
        B2 --> B6
        B3 --> B6
        B4 --> B6
        B2 --> B7
        B3 --> B7
        B4 --> B7
    end
```

## Мониторинг и логирование

```mermaid
flowchart LR
    A[Application] --> B[Winston Logger]
    B --> C[Console]
    B --> D[File]
    B --> E[Sentry]

    A --> F[Metrics]
    F --> G[Prometheus]
    G --> H[Grafana]

    A --> I[Health Checks]
    I --> J[UptimeRobot]

    E --> K[Alerts]
    J --> K
    K --> L[Email/Slack]
```

## Безопасность

```mermaid
flowchart TD
    A[Request] --> B[Rate Limiter]
    B --> C{Превышен лимит?}
    C -->|Да| D[429 Too Many Requests]
    C -->|Нет| E[CORS Check]
    E --> F{Разрешен origin?}
    F -->|Нет| G[403 Forbidden]
    F -->|Да| H[Helmet Headers]
    H --> I[JWT Validation]
    I --> J{Валидный токен?}
    J -->|Нет| K[401 Unauthorized]
    J -->|Да| L[Input Validation]
    L --> M{Валидные данные?}
    M -->|Нет| N[400 Bad Request]
    M -->|Да| O[Controller]
    O --> P[Response]
```

---

## Как использовать диаграммы

Эти диаграммы написаны в формате Mermaid и могут быть отображены:

1. **GitHub** - автоматически рендерит Mermaid в README
2. **VS Code** - установите расширение "Markdown Preview Mermaid Support"
3. **Mermaid Live Editor** - https://mermaid.live/
4. **Документация** - многие системы документации поддерживают Mermaid

## Легенда

- **Прямоугольник** - Процесс/Компонент
- **Ромб** - Условие/Решение
- **Стрелка** - Поток данных/Связь
- **Пунктирная линия** - Опциональная связь
- **Цилиндр** - База данных/Хранилище

---

_Диаграммы обновляются по мере развития проекта_
