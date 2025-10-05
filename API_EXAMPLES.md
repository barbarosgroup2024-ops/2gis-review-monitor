# Примеры использования API

Примеры запросов к API для разработчиков и интеграций.

## Базовый URL

```
http://localhost:5000/api
```

## Аутентификация

Все защищенные endpoints требуют JWT токен в заголовке:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Регистрация

### Запрос

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван Иванов"
}
```

### Ответ (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "status": "active"
  }
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Иван Иванов"
  }'
```

### JavaScript (Axios)

```javascript
const axios = require("axios");

const response = await axios.post("http://localhost:5000/api/auth/register", {
  email: "user@example.com",
  password: "password123",
  name: "Иван Иванов",
});

console.log(response.data.token);
```

---

## 2. Вход

### Запрос

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Ответ (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "status": "active"
  }
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## 3. Получить текущего пользователя

### Запрос

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Ответ (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "Иван Иванов",
  "status": "active",
  "created": "2024-01-15T10:30:00.000Z"
}
```

### cURL

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Создать компанию

### Запрос

```http
POST /api/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Моя Пекарня",
  "twoGisApiUrl": "https://public-api.reviews.2gis.com/3.0/orgs/70000001024523370/reviews?limit=50&key=YOUR_KEY",
  "telegramBotToken": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  "telegramChatId": "123456789"
}
```

### Ответ (201 Created)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "companyName": "Моя Пекарня",
  "twoGisApiUrl": "https://public-api.reviews.2gis.com/3.0/orgs/...",
  "telegramBotToken": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  "telegramChatId": "123456789",
  "sheetId": "1XpubswXWB--6I_VBzcB6cSCyafpmI0LO-8dpk70n71g",
  "active": true,
  "created": "2024-01-15T11:00:00.000Z"
}
```

### JavaScript

```javascript
const response = await axios.post(
  "http://localhost:5000/api/companies",
  {
    companyName: "Моя Пекарня",
    twoGisApiUrl: "https://public-api.reviews.2gis.com/3.0/orgs/...",
    telegramBotToken: "123456:ABC-DEF...",
    telegramChatId: "123456789",
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

---

## 5. Получить список компаний

### Запрос

```http
GET /api/companies
Authorization: Bearer <token>
```

### Ответ (200 OK)

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "companyName": "Моя Пекарня",
    "twoGisApiUrl": "https://public-api.reviews.2gis.com/3.0/orgs/...",
    "telegramBotToken": "123456:ABC-DEF...",
    "telegramChatId": "123456789",
    "sheetId": "1XpubswXWB--6I_VBzcB6cSCyafpmI0LO-8dpk70n71g",
    "active": true,
    "created": "2024-01-15T11:00:00.000Z"
  }
]
```

---

## 6. Получить компанию по ID

### Запрос

```http
GET /api/companies/660e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

### Ответ (200 OK)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "companyName": "Моя Пекарня",
  "twoGisApiUrl": "https://public-api.reviews.2gis.com/3.0/orgs/...",
  "telegramBotToken": "123456:ABC-DEF...",
  "telegramChatId": "123456789",
  "sheetId": "1XpubswXWB--6I_VBzcB6cSCyafpmI0LO-8dpk70n71g",
  "active": true,
  "created": "2024-01-15T11:00:00.000Z"
}
```

---

## 7. Обновить компанию

### Запрос

```http
PUT /api/companies/660e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Моя Новая Пекарня",
  "active": false
}
```

### Ответ (200 OK)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "companyName": "Моя Новая Пекарня",
  "twoGisApiUrl": "https://public-api.reviews.2gis.com/3.0/orgs/...",
  "telegramBotToken": "123456:ABC-DEF...",
  "telegramChatId": "123456789",
  "sheetId": "1XpubswXWB--6I_VBzcB6cSCyafpmI0LO-8dpk70n71g",
  "active": false,
  "created": "2024-01-15T11:00:00.000Z"
}
```

---

## 8. Удалить компанию

### Запрос

```http
DELETE /api/companies/660e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

### Ответ (200 OK)

```json
{
  "message": "Компания удалена"
}
```

---

## 9. Тестировать подключение к 2GIS

### Запрос

```http
POST /api/companies/660e8400-e29b-41d4-a716-446655440001/test
Authorization: Bearer <token>
```

### Ответ (200 OK) - Успех

```json
{
  "success": true,
  "message": "Подключение успешно",
  "reviewsCount": 15,
  "totalCount": 150,
  "orgRating": 4.5
}
```

### Ответ (200 OK) - Ошибка

```json
{
  "success": false,
  "error": "HTTP 401: Unauthorized",
  "details": {
    "message": "Invalid API key"
  }
}
```

---

## 10. Получить отзывы

### Запрос

```http
GET /api/reviews/660e8400-e29b-41d4-a716-446655440001?period=today
Authorization: Bearer <token>
```

**Параметры:**

- `period`: `today`, `yesterday`, `week`, `month`, `all` (по умолчанию: `today`)

### Ответ (200 OK)

```json
[
  {
    "id": "12345678",
    "date": "2024-01-15 14:30:00",
    "dateEdited": "",
    "userName": "Иван Петров",
    "address": "ул. Ленина, 10",
    "rating": "5",
    "text": "Отличная пекарня! Свежий хлеб каждый день."
  },
  {
    "id": "12345679",
    "date": "2024-01-15 12:15:00",
    "dateEdited": "",
    "userName": "Мария Сидорова",
    "address": "ул. Ленина, 10",
    "rating": "4",
    "text": "Хорошо, но иногда долго ждать."
  }
]
```

---

## 11. Получить статистику

### Запрос

```http
GET /api/reviews/660e8400-e29b-41d4-a716-446655440001/stats
Authorization: Bearer <token>
```

### Ответ (200 OK)

```json
{
  "total": 150,
  "today": 5,
  "yesterday": 8,
  "week": 35,
  "month": 120,
  "avgRating": "4.35",
  "ratingDistribution": {
    "1": 5,
    "2": 10,
    "3": 20,
    "4": 45,
    "5": 70
  }
}
```

---

## 12. Принудительно обновить отзывы

### Запрос

```http
POST /api/reviews/660e8400-e29b-41d4-a716-446655440001/refresh
Authorization: Bearer <token>
```

### Ответ (200 OK)

```json
{
  "message": "Отзывы обновлены",
  "newReviews": 3
}
```

---

## 13. Получить подписку

### Запрос

```http
GET /api/subscriptions/my
Authorization: Bearer <token>
```

### Ответ (200 OK)

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "plan": "trial",
  "startDate": "2024-01-15T10:30:00.000Z",
  "endDate": "2024-01-22T10:30:00.000Z",
  "status": "active"
}
```

---

## 14. Активировать подписку

### Запрос

```http
POST /api/subscriptions/activate
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "basic"
}
```

**Доступные планы:**

- `trial` - 7 дней, 1 компания
- `basic` - 30 дней, 3 компании
- `premium` - 30 дней, 10 компаний

### Ответ (200 OK)

```json
{
  "message": "Подписка активирована",
  "subscription": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "plan": "basic",
    "startDate": "2024-01-15T15:00:00.000Z",
    "endDate": "2024-02-14T15:00:00.000Z",
    "status": "active"
  }
}
```

---

## Коды ошибок

### 400 Bad Request

```json
{
  "error": "Все поля обязательны"
}
```

### 401 Unauthorized

```json
{
  "error": "Токен не предоставлен"
}
```

### 403 Forbidden

```json
{
  "error": "Доступ запрещен"
}
```

### 404 Not Found

```json
{
  "error": "Компания не найдена"
}
```

### 500 Internal Server Error

```json
{
  "error": "Ошибка сервера"
}
```

---

## Примеры интеграции

### Node.js с Axios

```javascript
const axios = require("axios");

class TwoGisReviewsClient {
  constructor(baseURL, token) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getCompanies() {
    const response = await this.client.get("/companies");
    return response.data;
  }

  async getReviews(companyId, period = "today") {
    const response = await this.client.get(
      `/reviews/${companyId}?period=${period}`
    );
    return response.data;
  }

  async getStats(companyId) {
    const response = await this.client.get(`/reviews/${companyId}/stats`);
    return response.data;
  }
}

// Использование
const client = new TwoGisReviewsClient(
  "http://localhost:5000/api",
  "YOUR_TOKEN"
);
const companies = await client.getCompanies();
console.log(companies);
```

### Python с requests

```python
import requests

class TwoGisReviewsClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}'
        }

    def get_companies(self):
        response = requests.get(
            f'{self.base_url}/companies',
            headers=self.headers
        )
        return response.json()

    def get_reviews(self, company_id, period='today'):
        response = requests.get(
            f'{self.base_url}/reviews/{company_id}',
            params={'period': period},
            headers=self.headers
        )
        return response.json()

# Использование
client = TwoGisReviewsClient('http://localhost:5000/api', 'YOUR_TOKEN')
companies = client.get_companies()
print(companies)
```

### PHP с cURL

```php
<?php

class TwoGisReviewsClient {
    private $baseUrl;
    private $token;

    public function __construct($baseUrl, $token) {
        $this->baseUrl = $baseUrl;
        $this->token = $token;
    }

    public function getCompanies() {
        $ch = curl_init($this->baseUrl . '/companies');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// Использование
$client = new TwoGisReviewsClient('http://localhost:5000/api', 'YOUR_TOKEN');
$companies = $client->getCompanies();
print_r($companies);
?>
```

---

## Webhook интеграция (будущая функция)

В будущих версиях планируется добавить webhook для получения уведомлений о новых отзывах:

```http
POST https://your-domain.com/webhook
Content-Type: application/json

{
  "event": "new_review",
  "companyId": "660e8400-e29b-41d4-a716-446655440001",
  "companyName": "Моя Пекарня",
  "review": {
    "id": "12345678",
    "date": "2024-01-15 14:30:00",
    "userName": "Иван Петров",
    "rating": "5",
    "text": "Отличная пекарня!"
  }
}
```

---

## Rate Limiting

В будущих версиях будет добавлен rate limiting:

- 100 запросов в минуту для обычных пользователей
- 1000 запросов в минуту для premium пользователей

---

## Поддержка

Если у вас есть вопросы по API, создайте issue в GitHub репозитории.
