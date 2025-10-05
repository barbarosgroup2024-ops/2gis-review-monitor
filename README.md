# 🎯 2GIS Reviews SaaS Platform

> Мультитенантная платформа для автоматического мониторинга отзывов с 2GIS с уведомлениями в Telegram

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

## Возможности

- 🔐 Регистрация и авторизация пользователей
- 📊 Личный кабинет для управления настройками
- 🔗 Подключение API 2GIS (пользователь вставляет свою ссылку)
- 📱 Интеграция с Telegram для уведомлений
- 📈 Статистика по отзывам (сегодня, вчера, неделя, месяц)
- 🔄 Автоматическая проверка новых отзывов каждые 5 минут
- 💾 Хранение данных в Google Sheets
- 💳 Система подписок (готова к интеграции платежей)

## Архитектура

```
├── server/              # Backend (Node.js + Express)
│   ├── index.js        # Точка входа
│   ├── routes/         # API маршруты
│   ├── controllers/    # Бизнес-логика
│   ├── services/       # Сервисы (2GIS, Telegram, Google Sheets)
│   ├── middleware/     # Middleware (auth, validation)
│   └── utils/          # Утилиты
├── client/             # Frontend (React)
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── pages/      # Страницы
│   │   ├── services/   # API клиенты
│   │   └── App.js      # Главный компонент
└── credentials/        # Google API credentials (не в git)
```

## Установка

### 1. Клонирование и установка зависимостей

```bash
# Установка backend зависимостей
npm install

# Установка frontend зависимостей
cd client
npm install
cd ..
```

### 2. Настройка Google Sheets API

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект
3. Включите Google Sheets API
4. Создайте Service Account
5. Скачайте JSON ключ и сохраните в `credentials/google-credentials.json`

### 3. Настройка переменных окружения

```bash
cp .env.example .env
# Отредактируйте .env файл
```

### 4. Создание мастер-таблицы Google Sheets

Создайте Google Sheets таблицу со следующими листами:

- **Users** - пользователи системы
- **Subscriptions** - подписки пользователей
- **Companies** - компании пользователей (настройки 2GIS API)

Структура листа **Users**:
| ID | Email | Password | Name | Created | Status |

Структура листа **Subscriptions**:
| UserID | Plan | StartDate | EndDate | Status |

Структура листа **Companies**:
| ID | UserID | CompanyName | TwoGisApiUrl | TelegramBotToken | TelegramChatId | SheetId | Active |

## Запуск

### Режим разработки

```bash
# Запуск backend и frontend одновременно
npm run dev:full

# Или раздельно:
# Backend (порт 5000)
npm run dev

# Frontend (порт 3000)
npm run client
```

### Продакшн

```bash
# Сборка frontend
npm run build

# Запуск сервера
npm start
```

## Использование

### Для пользователя:

1. **Регистрация** - создать аккаунт на платформе
2. **Добавить компанию** - вставить ссылку на API 2GIS
3. **Настроить Telegram** - указать токен бота и chat ID
4. **Получать уведомления** - система автоматически проверяет новые отзывы

### Получение ссылки 2GIS API:

Пользователь должен получить ссылку вида:

```
https://public-api.reviews.2gis.com/3.0/orgs/[ORG_ID]/reviews?limit=50&key=[API_KEY]&locale=ru_KG
```

### Настройка Telegram бота:

1. Создать бота через [@BotFather](https://t.me/botfather)
2. Получить токен бота
3. Получить свой Chat ID (через [@userinfobot](https://t.me/userinfobot))
4. Ввести данные в личном кабинете

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя

### Компании

- `GET /api/companies` - Список компаний пользователя
- `POST /api/companies` - Добавить компанию
- `PUT /api/companies/:id` - Обновить компанию
- `DELETE /api/companies/:id` - Удалить компанию

### Отзывы

- `GET /api/reviews/:companyId` - Получить отзывы компании
- `GET /api/reviews/:companyId/stats` - Статистика по отзывам

### Подписки

- `GET /api/subscriptions/my` - Моя подписка
- `POST /api/subscriptions/activate` - Активировать подписку

## Технологии

- **Backend**: Node.js, Express
- **Frontend**: React, Axios
- **Database**: Supabase (PostgreSQL) / Google Sheets API / Mock (in-memory)
- **Notifications**: Telegram Bot API
- **Scheduling**: node-cron
- **Authentication**: JWT

## 🚀 База данных

Проект поддерживает 3 режима работы с данными:

### 1. Supabase (PostgreSQL) - Рекомендуется ⭐

- ⚡ В 10-100 раз быстрее Google Sheets
- 📊 Профессиональная реляционная БД
- 🔒 Row Level Security
- 📈 Масштабируемость до миллионов записей
- 🆓 Бесплатно до 500MB

**Быстрый старт**: [QUICK_START_SUPABASE.md](./QUICK_START_SUPABASE.md)

### 2. Google Sheets - Legacy

- 📊 Простая настройка
- 👀 Визуальный просмотр данных
- ⚠️ Ограничения по скорости и объему

### 3. Mock Mode - Для разработки

- 💾 Данные в памяти
- 🚀 Быстрое тестирование
- ⚠️ Данные не сохраняются при перезапуске

## Roadmap

- [ ] Базовый функционал (регистрация, добавление компаний)
- [ ] Интеграция с 2GIS API
- [ ] Telegram уведомления
- [ ] Статистика и аналитика
- [ ] Интеграция платежей (Stripe/ЮKassa)
- [ ] Email уведомления
- [ ] Мобильное приложение
- [ ] Поддержка других платформ (Яндекс.Карты, Google Maps)

## Лицензия

MIT
