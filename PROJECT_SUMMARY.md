# Краткое описание проекта

## 🎯 Что это?

**2GIS Reviews SaaS** - мультитенантная платформа для автоматического мониторинга отзывов с 2GIS с уведомлениями в Telegram.

## ✨ Основные возможности

- 🔐 **Регистрация и авторизация** - безопасная система с JWT
- 📊 **Личный кабинет** - управление компаниями и настройками
- 🔗 **Интеграция с 2GIS** - автоматическое получение отзывов
- 📱 **Telegram уведомления** - мгновенные оповещения о новых отзывах
- 📈 **Статистика** - детальная аналитика по периодам
- 🔄 **Автоматизация** - проверка каждые 5 минут
- 💾 **Google Sheets** - надежное хранение данных
- 💳 **Система подписок** - trial, basic, premium тарифы

## 🏗️ Технологии

### Backend

- Node.js + Express
- Google Sheets API
- JWT аутентификация
- node-cron для автоматизации

### Frontend

- React
- React Router
- Axios

### Интеграции

- 2GIS Reviews API
- Telegram Bot API
- Google Sheets API

## 📁 Структура проекта

```
2-GIS/
├── server/                    # Backend (Node.js + Express)
│   ├── controllers/          # Бизнес-логика
│   ├── routes/              # API маршруты
│   ├── services/            # Внешние интеграции
│   ├── middleware/          # Middleware (auth)
│   └── index.js            # Точка входа
│
├── client/                   # Frontend (React)
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   └── services/       # API клиенты
│   └── public/
│
├── credentials/              # Google API credentials
│   └── google-credentials.json
│
└── docs/                     # Документация
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── QUICKSTART.md
    ├── ARCHITECTURE.md
    ├── FAQ.md
    ├── API_EXAMPLES.md
    ├── CHANGELOG.md
    ├── TODO.md
    └── CONTRIBUTING.md
```

## 🚀 Быстрый старт

### 1. Установка

```bash
npm install
cd client && npm install && cd ..
```

### 2. Настройка Google Sheets API

- Создайте проект в Google Cloud Console
- Включите Google Sheets API
- Создайте Service Account
- Скачайте credentials

### 3. Настройка .env

```bash
cp .env.example .env
# Отредактируйте .env
```

### 4. Запуск

```bash
npm run dev:full
```

### 5. Откройте

```
http://localhost:3000
```

## 📚 Документация

| Файл                               | Описание                          |
| ---------------------------------- | --------------------------------- |
| [README.md](README.md)             | Основная документация             |
| [QUICKSTART.md](QUICKSTART.md)     | Быстрый старт за 15 минут         |
| [SETUP_GUIDE.md](SETUP_GUIDE.md)   | Подробная инструкция по установке |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Описание архитектуры системы      |
| [FAQ.md](FAQ.md)                   | Часто задаваемые вопросы          |
| [API_EXAMPLES.md](API_EXAMPLES.md) | Примеры использования API         |
| [CHANGELOG.md](CHANGELOG.md)       | История изменений                 |
| [TODO.md](TODO.md)                 | Планы развития                    |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Руководство для контрибьюторов    |

## 🎨 Основные компоненты

### Backend

**Controllers** (Контроллеры)

- `authController.js` - регистрация, вход, профиль
- `companyController.js` - управление компаниями
- `reviewController.js` - получение отзывов и статистики
- `subscriptionController.js` - управление подписками

**Services** (Сервисы)

- `googleSheets.js` - работа с Google Sheets
- `twoGis.js` - интеграция с 2GIS API
- `telegram.js` - отправка уведомлений
- `reviewChecker.js` - автоматическая проверка отзывов

**Routes** (Маршруты)

- `/api/auth/*` - аутентификация
- `/api/companies/*` - компании
- `/api/reviews/*` - отзывы
- `/api/subscriptions/*` - подписки

### Frontend

**Pages** (Страницы)

- `Login.js` - вход
- `Register.js` - регистрация
- `Dashboard.js` - главная страница
- `Companies.js` - список компаний
- `CompanyDetails.js` - детали компании и отзывы
- `Profile.js` - профиль пользователя

**Components** (Компоненты)

- `Header.js` - шапка с навигацией

**Services** (Сервисы)

- `auth.js` - аутентификация
- `api.js` - API клиент

## 🔄 Как это работает

### 1. Регистрация пользователя

```
User → Register → Create account → Get 7 days trial → Login
```

### 2. Добавление компании

```
User → Add company → Enter 2GIS API URL → Configure Telegram → Save
```

### 3. Автоматическая проверка отзывов

```
Cron (every 5 min) → Get active companies → Fetch reviews from 2GIS
→ Compare with existing → Save new reviews → Send Telegram notifications
→ Update statistics
```

### 4. Просмотр отзывов

```
User → Open company → Select period → View reviews and stats
```

## 💡 Ключевые особенности

### Мультитенантность

- Каждый пользователь имеет свой аккаунт
- Каждая компания имеет свою Google Sheets таблицу
- Изоляция данных между пользователями

### Автоматизация

- Cron job проверяет отзывы каждые 5 минут
- Автоматическое обновление статистики
- Мгновенные уведомления в Telegram

### Безопасность

- JWT аутентификация
- Хеширование паролей (bcrypt)
- Проверка прав доступа
- Валидация входных данных

### Масштабируемость

- Готовность к переходу на PostgreSQL/MongoDB
- Возможность добавления кэширования
- Микросервисная архитектура (в планах)

## 📊 Тарифы

| Тариф   | Компаний | Длительность | Цена      |
| ------- | -------- | ------------ | --------- |
| Trial   | 1        | 7 дней       | Бесплатно |
| Basic   | 3        | 30 дней      | TBD       |
| Premium | 10       | 30 дней      | TBD       |

_Интеграция платежей в разработке_

## 🛣️ Roadmap

### v1.0 (Текущая) ✅

- Базовый функционал
- Telegram уведомления
- Статистика
- Система подписок

### v1.1 (Планируется)

- Интеграция платежей
- Email уведомления
- Экспорт отчетов
- Улучшенная аналитика

### v1.2 (Планируется)

- Яндекс.Карты интеграция
- Google Maps интеграция
- Webhook для интеграций
- Шаблоны ответов

### v2.0 (Планируется)

- Мобильное приложение
- AI анализ отзывов
- Командная работа
- White label решение

## 🤝 Вклад в проект

Мы приветствуем любой вклад! Смотрите [CONTRIBUTING.md](CONTRIBUTING.md) для деталей.

### Как помочь

- 🐛 Сообщить об ошибке
- 💡 Предложить улучшение
- 📝 Улучшить документацию
- 💻 Внести код
- ⭐ Поставить звезду на GitHub

## 📞 Контакты

- GitHub: [your-repo](https://github.com/your-repo)
- Email: your-email@example.com
- Telegram: @your_telegram

## 📄 Лицензия

MIT License - смотрите [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

Спасибо всем, кто использует и развивает этот проект!

### Используемые библиотеки

- Express - веб-фреймворк
- React - UI библиотека
- Google APIs - интеграция с Google Sheets
- Axios - HTTP клиент
- node-cron - планировщик задач
- bcryptjs - хеширование паролей
- jsonwebtoken - JWT аутентификация

---

## 📈 Статистика проекта

- **Версия:** 1.0.0
- **Дата релиза:** 2024-01-15
- **Язык:** JavaScript (Node.js + React)
- **Лицензия:** MIT
- **Статус:** Active Development

---

## 🎯 Цели проекта

1. **Упростить мониторинг отзывов** - автоматизация рутинных задач
2. **Мгновенные уведомления** - не пропустить ни одного отзыва
3. **Детальная аналитика** - понимать тренды и динамику
4. **Доступность** - простая установка и использование
5. **Масштабируемость** - от одной компании до тысяч

---

**Создано с ❤️ для бизнеса**

_Последнее обновление: 2024-01-15_
