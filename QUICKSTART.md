# Быстрый старт 🚀

Краткая инструкция для запуска системы за 15 минут.

## Шаг 1: Установка (2 минуты)

```powershell
# Установка зависимостей
npm install

# Установка frontend зависимостей
cd client
npm install
cd ..
```

## Шаг 2: Google Sheets API (5 минут)

### 2.1 Создайте проект

1. Откройте https://console.cloud.google.com/
2. Создайте новый проект
3. Включите Google Sheets API

### 2.2 Создайте Service Account

1. APIs & Services → Credentials
2. Create Credentials → Service Account
3. Скачайте JSON ключ
4. Сохраните как `credentials/google-credentials.json`

### 2.3 Создайте таблицу

1. Откройте https://sheets.google.com/
2. Создайте новую таблицу "2GIS Reviews Master"
3. Создайте 3 листа: **Users**, **Subscriptions**, **Companies**

**Users** (заголовки):

```
ID | Email | Password | Name | Created | Status
```

**Subscriptions** (заголовки):

```
UserID | Plan | StartDate | EndDate | Status
```

**Companies** (заголовки):

```
ID | UserID | CompanyName | TwoGisApiUrl | TelegramBotToken | TelegramChatId | SheetId | Active | Created
```

### 2.4 Предоставьте доступ

1. Откройте `credentials/google-credentials.json`
2. Скопируйте `client_email`
3. В Google Sheets: Поделиться → вставьте email → Редактор
4. Скопируйте ID таблицы из URL

## Шаг 3: Настройка (2 минуты)

```powershell
# Создайте .env файл
Copy-Item .env.example .env
```

Отредактируйте `.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=ваш_секретный_ключ_минимум_32_символа
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-credentials.json
MASTER_SPREADSHEET_ID=ваш_id_таблицы
FRONTEND_URL=http://localhost:3000
REVIEW_CHECK_SCHEDULE=*/5 * * * *
```

## Шаг 4: Запуск (1 минута)

```powershell
# Запустите backend и frontend одновременно
npm run dev:full
```

Откройте http://localhost:3000

## Шаг 5: Регистрация (1 минута)

1. Нажмите "Зарегистрироваться"
2. Заполните форму
3. Получите 7 дней бесплатного доступа

## Шаг 6: Добавьте компанию (2 минуты)

1. Перейдите в "Компании"
2. Нажмите "Добавить компанию"
3. Заполните:
   - Название компании
   - URL API 2GIS
   - (Опционально) Telegram Bot Token
   - (Опционально) Telegram Chat ID

## Шаг 7: Настройте Telegram (2 минуты)

### Создайте бота:

1. Найдите @BotFather в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен

### Получите Chat ID:

1. Найдите @userinfobot
2. Отправьте любое сообщение
3. Скопируйте ваш ID

### Добавьте в систему:

1. Вставьте токен и Chat ID в настройки компании
2. Сохраните

## Готово! ✅

Система автоматически проверяет отзывы каждые 5 минут и отправляет уведомления в Telegram.

---

## Быстрая проверка

### Тест подключения к 2GIS:

1. Откройте компанию
2. Нажмите "Тестировать подключение"
3. Должно показать количество отзывов

### Ручное обновление:

1. Откройте компанию
2. Нажмите "🔄 Обновить"
3. Отзывы появятся в списке

### Проверка Telegram:

1. Убедитесь, что написали боту первое сообщение
2. Дождитесь новых отзывов или нажмите "Обновить"
3. Уведомление придёт в Telegram

---

## Возникли проблемы?

### Ошибка с Google Sheets?

→ Проверьте, что Service Account имеет доступ к таблице

### Telegram не работает?

→ Убедитесь, что написали боту первое сообщение

### Отзывы не появляются?

→ Проверьте правильность URL API 2GIS

### Другие проблемы?

→ Смотрите [FAQ.md](FAQ.md) или [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## Полезные ссылки

- 📖 [Полная инструкция](SETUP_GUIDE.md)
- 🏗️ [Архитектура](ARCHITECTURE.md)
- ❓ [FAQ](FAQ.md)
- 📝 [README](README.md)

---

**Приятного использования! 🎉**
