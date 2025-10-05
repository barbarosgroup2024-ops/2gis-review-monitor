# 🚂 Деплой на Railway

## 📋 Подготовка

### 1. Убедитесь, что код закоммичен в Git

```powershell
git status
git add .
git commit -m "Готов к деплою на Railway"
git push
```

### 2. Создайте аккаунт на Railway

Перейдите на https://railway.app/ и зарегистрируйтесь через GitHub.

---

## 🚀 Деплой

### Шаг 1: Создание проекта

1. Откройте https://railway.app/new
2. Нажмите **"Deploy from GitHub repo"**
3. Выберите ваш репозиторий `2 GIS`
4. Railway автоматически определит Node.js проект

### Шаг 2: Настройка переменных окружения

После создания проекта:

1. Откройте ваш проект в Railway
2. Перейдите на вкладку **"Variables"**
3. Добавьте следующие переменные:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=ваш_секретный_ключ_минимум_32_символа
SUPABASE_URL=https://ваш-проект.supabase.co
SUPABASE_SERVICE_KEY=ваш_service_role_key_из_supabase
TELEGRAM_BOT_TOKEN=ваш_токен_бота_от_BotFather
REVIEW_CHECK_SCHEDULE=*/5 * * * *
```

#### 📝 Где взять значения:

- **JWT_SECRET**: Сгенерируйте случайную строку минимум 32 символа

  ```powershell
  # В PowerShell:
  -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
  ```

- **SUPABASE_URL** и **SUPABASE_SERVICE_KEY**:

  - Откройте https://supabase.com/dashboard
  - Выберите ваш проект
  - Перейдите в Settings → API
  - Скопируйте URL и service_role key

- **TELEGRAM_BOT_TOKEN**:
  - Откройте Telegram
  - Найдите @BotFather
  - Скопируйте токен вашего бота

### Шаг 3: Настройка домена

1. В Railway перейдите в **"Settings"**
2. В разделе **"Domains"** нажмите **"Generate Domain"**
3. Railway создаст домен типа `your-app.up.railway.app`
4. Или добавьте свой домен

### Шаг 4: Деплой

Railway автоматически начнет деплой после добавления переменных окружения.

Вы можете следить за процессом в разделе **"Deployments"**.

---

## ✅ Проверка

### 1. Проверьте логи

В Railway откройте вкладку **"Logs"** и убедитесь, что:

```
✅ Telegram бот инициализирован
🚀 Сервер запущен на порту 5000
📅 Проверка отзывов по расписанию: */5 * * * *
🌍 Окружение: production
```

### 2. Проверьте API

Откройте в браузере:

```
https://your-app.up.railway.app/api/health
```

Должен вернуться JSON:

```json
{
  "status": "ok",
  "timestamp": "2025-01-10T..."
}
```

### 3. Проверьте фронтенд

Откройте:

```
https://your-app.up.railway.app
```

Должна открыться страница входа.

### 4. Проверьте Telegram бота

1. Откройте Telegram
2. Найдите вашего бота
3. Отправьте `/start КОД_АКТИВАЦИИ`
4. Должно прийти сообщение об успешной активации

---

## 🔧 Обновление приложения

Railway автоматически деплоит при каждом push в main ветку:

```powershell
git add .
git commit -m "Обновление"
git push
```

Railway автоматически:

1. Обнаружит изменения
2. Соберет новую версию
3. Задеплоит её

---

## 🐛 Troubleshooting

### Проблема: Бот не отвечает

**Решение:**

1. Проверьте логи в Railway
2. Убедитесь, что `TELEGRAM_BOT_TOKEN` правильный
3. Проверьте, что в логах есть `✅ Telegram бот инициализирован`

### Проблема: Ошибка подключения к Supabase

**Решение:**

1. Проверьте `SUPABASE_URL` и `SUPABASE_SERVICE_KEY`
2. Убедитесь, что используете **service_role** key, а не anon key
3. Проверьте, что в Supabase выполнена миграция (есть таблицы)

### Проблема: Frontend не загружается

**Решение:**

1. Проверьте логи сборки в Railway
2. Убедитесь, что `npm run build` выполнился успешно
3. Проверьте, что `NODE_ENV=production`

### Проблема: Ошибка при сборке

**Решение:**

1. Проверьте, что все зависимости установлены
2. Попробуйте локально:
   ```powershell
   npm install
   npm run build
   npm start
   ```
3. Если локально работает, проверьте логи Railway

---

## 📊 Мониторинг

### Логи

Railway предоставляет логи в реальном времени:

- Откройте проект
- Перейдите на вкладку **"Logs"**
- Фильтруйте по типу (info, error, warning)

### Метрики

Railway показывает:

- CPU usage
- Memory usage
- Network traffic
- Request count

### Алерты

Настройте уведомления:

1. Перейдите в **"Settings"**
2. Настройте **"Notifications"**
3. Добавьте email или webhook

---

## 💰 Стоимость

Railway предоставляет:

- **$5 бесплатно** каждый месяц
- **Pay-as-you-go** после использования бесплатного лимита

Для небольшого проекта обычно достаточно бесплатного лимита.

---

## 🔐 Безопасность

### Рекомендации:

1. **Никогда не коммитьте .env файл**

   - Убедитесь, что `.env` в `.gitignore`

2. **Используйте сильные пароли**

   - JWT_SECRET минимум 32 символа
   - Используйте генератор паролей

3. **Регулярно обновляйте зависимости**

   ```powershell
   npm audit
   npm audit fix
   ```

4. **Мониторьте логи**
   - Проверяйте на подозрительную активность
   - Настройте алерты

---

## 📚 Дополнительные ресурсы

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

---

## ✨ Готово!

Ваше приложение теперь доступно по адресу:

```
https://your-app.up.railway.app
```

Поделитесь ссылкой с пользователями! 🎉
