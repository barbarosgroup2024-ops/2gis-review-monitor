# 🔄 Как работает система

## 📋 Оглавление

1. [Общая схема](#общая-схема)
2. [Регистрация пользователя](#регистрация-пользователя)
3. [Добавление компании](#добавление-компании)
4. [Мониторинг отзывов](#мониторинг-отзывов)
5. [Уведомления в Telegram](#уведомления-в-telegram)
6. [Система подписок](#система-подписок)

---

## 🎯 Общая схема

```
┌─────────────────────────────────────────────────────────────┐
│                    ПОЛЬЗОВАТЕЛЬ                              │
│                                                               │
│  1. Регистрируется на сайте                                  │
│  2. Добавляет свою компанию (ссылка на 2GIS)                │
│  3. Указывает Telegram Chat ID                               │
│  4. Получает уведомления о новых отзывах                     │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  REACT FRONTEND                              │
│                  http://localhost:3000                       │
│                                                               │
│  - Страница регистрации/входа                                │
│  - Dashboard с компаниями                                    │
│  - Форма добавления компании                                 │
│  - Просмотр отзывов                                          │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                  EXPRESS BACKEND                             │
│                  http://localhost:5000                       │
│                                                               │
│  API Endpoints:                                              │
│  - POST /api/auth/register                                   │
│  - POST /api/auth/login                                      │
│  - GET  /api/companies                                       │
│  - POST /api/companies                                       │
│  - GET  /api/reviews/:companyId                              │
│                                                               │
│  Cron Job (каждые 5 минут):                                 │
│  - Проверка новых отзывов для всех компаний                 │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  GOOGLE SHEETS (БД)                          │
│                                                               │
│  Master таблица:                                             │
│  ├── Users (пользователи)                                    │
│  ├── Subscriptions (подписки)                                │
│  └── Companies (компании)                                    │
│                                                               │
│  Таблица каждой компании:                                    │
│  ├── 2GIS (все отзывы)                                       │
│  ├── Сегодня                                                 │
│  ├── Вчера                                                   │
│  ├── Неделя                                                  │
│  ├── Месяц                                                   │
│  └── Отправлено (ID отправленных уведомлений)                │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    2GIS API                                  │
│                                                               │
│  GET /reviews?org_id=...&key=...                             │
│  → Возвращает список отзывов                                 │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  TELEGRAM BOT API                            │
│                                                               │
│  POST /bot{TOKEN}/sendMessage                                │
│  → Отправляет уведомление пользователю                       │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  ПОЛЬЗОВАТЕЛЬ (Telegram)                     │
│                                                               │
│  Получает сообщение:                                         │
│  📌 Источник: 2GIS                                           │
│  📅 Дата: пн 15 янв 2024                                     │
│  👤 Имя: Иван Иванов                                         │
│  📍 Адрес: ул. Ленина, 1                                     │
│  ⭐️ Рейтинг: 5                                               │
│  📝 Отзыв: Отличный сервис!                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 Регистрация пользователя

### Шаг 1: Пользователь заполняет форму

```
Имя: Иван Петров
Email: ivan@example.com
Пароль: ********
```

### Шаг 2: Frontend отправляет запрос

```javascript
POST /api/auth/register
{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "********"
}
```

### Шаг 3: Backend обрабатывает

```javascript
1. Проверяет, что email уникален
2. Хеширует пароль (bcrypt)
3. Создает пользователя в Google Sheets (лист "Users")
4. Создает Trial подписку (лист "Subscriptions")
   - План: Trial
   - Срок: 7 дней
   - Компаний: 1
5. Возвращает JWT токен
```

### Шаг 4: Пользователь получает доступ

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "name": "Иван Петров",
    "email": "ivan@example.com"
  }
}
```

---

## 🏢 Добавление компании

### Шаг 1: Пользователь заполняет форму

```
Название: Моя Пиццерия
Ссылка на 2GIS: https://2gis.ru/moscow/firm/70000001024523370
API ключ 2GIS: 6e7e1929-4ea9-4a5d-8c05-d601860389bd
Telegram Chat ID: 7737197594
```

### Шаг 2: Frontend отправляет запрос

```javascript
POST /api/companies
Authorization: Bearer {token}
{
  "name": "Моя Пиццерия",
  "twoGisUrl": "https://2gis.ru/moscow/firm/70000001024523370",
  "twoGisApiKey": "6e7e1929-4ea9-4a5d-8c05-d601860389bd",
  "telegramChatId": "7737197594"
}
```

### Шаг 3: Backend обрабатывает

```javascript
1. Проверяет подписку пользователя
   - Активна ли?
   - Не превышен ли лимит компаний?

2. Извлекает org_id из URL 2GIS
   URL: https://2gis.ru/moscow/firm/70000001024523370
   org_id: 70000001024523370

3. Создает новую Google Таблицу для компании
   - Лист "2GIS"
   - Лист "Сегодня"
   - Лист "Вчера"
   - Лист "Неделя"
   - Лист "Месяц"
   - Лист "Отправлено"

4. Дает доступ Service Account к таблице

5. Сохраняет компанию в Master таблице (лист "Companies")
   {
     id: "company_123",
     userId: "user_123",
     name: "Моя Пиццерия",
     twoGisUrl: "...",
     twoGisApiKey: "...",
     telegramChatId: "7737197594",
     spreadsheetId: "1XpubswXWB--6I_VBzcB6cSCyafpmI0LO-8dpk70n71g",
     isActive: true,
     createdAt: "2024-01-15T10:00:00Z"
   }
```

### Шаг 4: Компания добавлена!

```javascript
{
  "id": "company_123",
  "name": "Моя Пиццерия",
  "spreadsheetId": "1XpubswXWB--6I_VBzcB6cSCyafpmI0LO-8dpk70n71g",
  "isActive": true
}
```

---

## 🔄 Мониторинг отзывов

### Cron Job запускается каждые 5 минут

```javascript
// server/services/reviewChecker.js

setInterval(async () => {
  console.log("🔍 Проверка новых отзывов...");

  // 1. Получить все активные компании
  const companies = await getAllActiveCompanies();

  // 2. Для каждой компании
  for (const company of companies) {
    // 3. Получить отзывы из 2GIS API
    const reviews = await fetch2GisReviews(
      company.twoGisOrgId,
      company.twoGisApiKey
    );

    // 4. Получить существующие отзывы из Google Sheets
    const existingReviews = await getExistingReviews(company.spreadsheetId);

    // 5. Найти новые отзывы
    const newReviews = reviews.filter(
      (review) => !existingReviews.includes(review.text)
    );

    // 6. Если есть новые отзывы
    if (newReviews.length > 0) {
      // 7. Сохранить в Google Sheets
      await saveReviewsToSheet(company.spreadsheetId, newReviews);

      // 8. Обновить статистику (Сегодня, Вчера, Неделя, Месяц)
      await updateStatistics(company.spreadsheetId);

      // 9. Отправить уведомления в Telegram
      await sendTelegramNotifications(company.telegramChatId, newReviews);
    }
  }
}, 5 * 60 * 1000); // 5 минут
```

### Пример запроса к 2GIS API

```javascript
GET https://public-api.reviews.2gis.com/3.0/orgs/70000001024523370/reviews
  ?limit=50
  &key=6e7e1929-4ea9-4a5d-8c05-d601860389bd
  &locale=ru_KG

Response:
{
  "reviews": [
    {
      "id": "review_123",
      "text": "Отличная пиццерия!",
      "rating": 5,
      "date_created": "2024-01-15T10:30:00Z",
      "user": {
        "name": "Иван Иванов"
      },
      "object": {
        "address": "ул. Ленина, 1"
      }
    }
  ]
}
```

### Сохранение в Google Sheets

```
Лист "2GIS":
┌────────────┬─────────────────────┬─────────────────────┬──────────────┬─────────────┬──────────┬────────────────────┐
│ ID         │ Дата                │ Дата редактирования │ Пользователь │ Адрес       │ Рейтинг  │ Отзыв              │
├────────────┼─────────────────────┼─────────────────────┼──────────────┼─────────────┼──────────┼────────────────────┤
│ review_123 │ 2024-01-15 10:30:00 │                     │ Иван Иванов  │ ул. Ленина  │ 5        │ Отличная пиццерия! │
└────────────┴─────────────────────┴─────────────────────┴──────────────┴─────────────┴──────────┴────────────────────┘
```

---

## 📱 Уведомления в Telegram

### Шаг 1: Формирование сообщения

```javascript
const message = `
📌 Источник: 2GIS
📅 Дата: пн 15 янв 2024
👤 Имя: Иван Иванов
📍 Адрес: ул. Ленина, 1
⭐️ Рейтинг: 5
📝 Отзыв:
Отличная пиццерия! Быстрая доставка, вкусная пицца!
`;
```

### Шаг 2: Отправка через Telegram Bot API

```javascript
POST https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage
{
  "chat_id": "7737197594",
  "text": "📌 Источник: 2GIS\n📅 Дата: пн 15 янв 2024...",
  "parse_mode": "HTML"
}
```

### Шаг 3: Сохранение ID отправленного отзыва

```javascript
// Чтобы не отправлять дважды
await saveToSheet(company.spreadsheetId, "Отправлено", [review.id]);
```

---

## 💳 Система подписок

### Планы подписок

```javascript
const PLANS = {
  TRIAL: {
    name: "Trial",
    duration: 7, // дней
    maxCompanies: 1,
    price: 0,
  },
  BASIC: {
    name: "Basic",
    duration: 30, // дней
    maxCompanies: 3,
    price: 990, // рублей
  },
  PREMIUM: {
    name: "Premium",
    duration: 30, // дней
    maxCompanies: 10,
    price: 2990, // рублей
  },
};
```

### Проверка подписки

```javascript
// При добавлении компании
async function checkSubscription(userId) {
  // 1. Получить подписку пользователя
  const subscription = await getSubscription(userId);

  // 2. Проверить статус
  if (subscription.status !== "active") {
    throw new Error("Подписка неактивна");
  }

  // 3. Проверить срок
  const now = new Date();
  const endDate = new Date(subscription.endDate);
  if (now > endDate) {
    throw new Error("Подписка истекла");
  }

  // 4. Проверить лимит компаний
  const companiesCount = await getCompaniesCount(userId);
  if (companiesCount >= subscription.maxCompanies) {
    throw new Error("Достигнут лимит компаний");
  }

  return true;
}
```

### Обновление подписки

```javascript
// Пользователь оплачивает Basic
POST /api/subscriptions/upgrade
{
  "plan": "BASIC",
  "paymentId": "payment_123"
}

// Backend обновляет в Google Sheets
{
  id: "sub_123",
  userId: "user_123",
  plan: "BASIC",
  status: "active",
  startDate: "2024-01-15T00:00:00Z",
  endDate: "2024-02-15T00:00:00Z",
  maxCompanies: 3
}
```

---

## 🔄 Полный цикл работы

### День 1: Регистрация

```
10:00 - Пользователь регистрируется
10:01 - Получает Trial подписку (7 дней, 1 компания)
10:05 - Добавляет свою компанию
10:10 - Система начинает мониторинг (каждые 5 минут)
```

### День 1-7: Мониторинг

```
Каждые 5 минут:
  ├── Проверка новых отзывов в 2GIS
  ├── Сохранение в Google Sheets
  ├── Обновление статистики
  └── Отправка уведомлений в Telegram
```

### День 7: Окончание Trial

```
23:59 - Trial подписка истекает
00:00 - Пользователь не может добавлять новые компании
      - Существующие компании продолжают работать (grace period)
```

### День 8: Upgrade

```
10:00 - Пользователь оплачивает Basic
10:01 - Подписка обновляется (30 дней, 3 компании)
10:05 - Может добавить еще 2 компании
```

---

## 📊 Статистика

### Обновление статистики

```javascript
// Каждый раз после добавления новых отзывов
async function updateStatistics(spreadsheetId) {
  // 1. Получить все отзывы
  const allReviews = await getReviews(spreadsheetId, "2GIS");

  // 2. Фильтровать по периодам
  const today = filterByDate(allReviews, "today");
  const yesterday = filterByDate(allReviews, "yesterday");
  const week = filterByDate(allReviews, "week");
  const month = filterByDate(allReviews, "month");

  // 3. Обновить листы
  await updateSheet(spreadsheetId, "Сегодня", today);
  await updateSheet(spreadsheetId, "Вчера", yesterday);
  await updateSheet(spreadsheetId, "Неделя", week);
  await updateSheet(spreadsheetId, "Месяц", month);
}
```

### Просмотр статистики

```javascript
GET /api/reviews/:companyId?period=today

Response:
{
  "period": "today",
  "count": 5,
  "averageRating": 4.6,
  "reviews": [
    {
      "id": "review_123",
      "text": "Отличная пиццерия!",
      "rating": 5,
      "date": "2024-01-15T10:30:00Z",
      "user": "Иван Иванов"
    }
  ]
}
```

---

## 🎯 Итого

### Что происходит автоматически:

1. ✅ Проверка новых отзывов каждые 5 минут
2. ✅ Сохранение в Google Sheets
3. ✅ Обновление статистики
4. ✅ Отправка уведомлений в Telegram
5. ✅ Проверка подписок
6. ✅ Управление доступом

### Что делает пользователь:

1. ✅ Регистрируется
2. ✅ Добавляет компании
3. ✅ Получает уведомления
4. ✅ Просматривает статистику
5. ✅ Обновляет подписку

---

**Всё работает автоматически! 🎉**

Подробнее:

- `ARCHITECTURE.md` - Техническая архитектура
- `API_EXAMPLES.md` - Примеры API запросов
- `DIAGRAMS.md` - Диаграммы системы
