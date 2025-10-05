# Руководство по деплою

Инструкции по развертыванию приложения в продакшн.

## Содержание

- [Подготовка к деплою](#подготовка-к-деплою)
- [Heroku](#heroku)
- [Railway](#railway)
- [Render](#render)
- [DigitalOcean](#digitalocean)
- [VPS (Ubuntu)](#vps-ubuntu)
- [Docker](#docker)

---

## Подготовка к деплою

### 1. Проверка кода

```bash
# Запустите тесты
npm test

# Проверьте линтером
npm run lint

# Соберите frontend
cd client
npm run build
cd ..
```

### 2. Переменные окружения

Убедитесь, что все переменные настроены:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<strong-random-secret-min-32-chars>
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-credentials.json
MASTER_SPREADSHEET_ID=<your-spreadsheet-id>
FRONTEND_URL=https://your-domain.com
REVIEW_CHECK_SCHEDULE=*/5 * * * *
```

### 3. Google Credentials

Для продакшн рекомендуется использовать переменную окружения вместо файла:

```javascript
// server/services/googleSheets.js
const credentials = process.env.GOOGLE_CREDENTIALS
  ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
  : require(CREDENTIALS_PATH);
```

---

## Heroku

### Установка Heroku CLI

```bash
# Windows (PowerShell)
# Скачайте с https://devcenter.heroku.com/articles/heroku-cli

# Проверка установки
heroku --version
```

### Деплой

```bash
# 1. Вход в Heroku
heroku login

# 2. Создание приложения
heroku create your-app-name

# 3. Установка переменных окружения
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MASTER_SPREADSHEET_ID=your_spreadsheet_id
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com

# 4. Установка Google Credentials
# Скопируйте содержимое google-credentials.json
heroku config:set GOOGLE_CREDENTIALS='{"type":"service_account",...}'

# 5. Добавление buildpack для Node.js
heroku buildpacks:set heroku/nodejs

# 6. Деплой
git push heroku main

# 7. Открыть приложение
heroku open

# 8. Просмотр логов
heroku logs --tail
```

### Procfile

Создайте файл `Procfile` в корне проекта:

```
web: node server/index.js
```

### package.json

Добавьте скрипты:

```json
{
  "scripts": {
    "start": "node server/index.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

### Настройка статических файлов

В `server/index.js`:

```javascript
// Serve static files from React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}
```

---

## Railway

### Деплой через GitHub

1. Зарегистрируйтесь на https://railway.app/
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Выберите ваш репозиторий
5. Railway автоматически определит Node.js проект

### Настройка переменных

1. Откройте проект в Railway
2. Перейдите в "Variables"
3. Добавьте переменные:
   ```
   NODE_ENV=production
   JWT_SECRET=your_secret_key
   MASTER_SPREADSHEET_ID=your_spreadsheet_id
   GOOGLE_CREDENTIALS={"type":"service_account",...}
   ```

### Настройка домена

1. Перейдите в "Settings"
2. В разделе "Domains" нажмите "Generate Domain"
3. Или добавьте свой домен

### Автоматический деплой

Railway автоматически деплоит при каждом push в main ветку.

---

## Render

### Деплой через GitHub

1. Зарегистрируйтесь на https://render.com/
2. Нажмите "New +" → "Web Service"
3. Подключите GitHub репозиторий
4. Настройте:
   - **Name**: your-app-name
   - **Environment**: Node
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `node server/index.js`

### Настройка переменных

1. В разделе "Environment" добавьте переменные
2. Или создайте файл `render.yaml`:

```yaml
services:
  - type: web
    name: 2gis-reviews
    env: node
    buildCommand: npm install && cd client && npm install && npm run build
    startCommand: node server/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: MASTER_SPREADSHEET_ID
        sync: false
      - key: GOOGLE_CREDENTIALS
        sync: false
```

---

## DigitalOcean

### App Platform

1. Зарегистрируйтесь на https://www.digitalocean.com/
2. Перейдите в "App Platform"
3. Нажмите "Create App"
4. Подключите GitHub репозиторий
5. Настройте:
   - **Type**: Web Service
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Run Command**: `node server/index.js`

### Настройка переменных

В разделе "Environment Variables" добавьте все необходимые переменные.

---

## VPS (Ubuntu)

### Подготовка сервера

```bash
# Обновление системы
sudo apt update
sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Установка Nginx
sudo apt install -y nginx

# Установка Git
sudo apt install -y git
```

### Клонирование проекта

```bash
# Создание директории
cd /var/www
sudo mkdir 2gis-reviews
sudo chown $USER:$USER 2gis-reviews
cd 2gis-reviews

# Клонирование
git clone https://github.com/your-username/2gis-reviews-saas.git .

# Установка зависимостей
npm install
cd client
npm install
npm run build
cd ..
```

### Настройка переменных

```bash
# Создание .env файла
nano .env

# Добавьте все переменные
NODE_ENV=production
PORT=5000
...
```

### Настройка PM2

```bash
# Запуск приложения
pm2 start server/index.js --name 2gis-reviews

# Автозапуск при перезагрузке
pm2 startup
pm2 save

# Просмотр логов
pm2 logs 2gis-reviews

# Перезапуск
pm2 restart 2gis-reviews
```

### Настройка Nginx

```bash
# Создание конфигурации
sudo nano /etc/nginx/sites-available/2gis-reviews

# Добавьте:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/2gis-reviews /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Настройка SSL (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com

# Автообновление сертификата
sudo certbot renew --dry-run
```

### Обновление приложения

```bash
cd /var/www/2gis-reviews

# Получение изменений
git pull

# Обновление зависимостей
npm install
cd client
npm install
npm run build
cd ..

# Перезапуск
pm2 restart 2gis-reviews
```

---

## Docker

### Dockerfile

Создайте `Dockerfile` в корне проекта:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

COPY client/package*.json ./client/
RUN cd client && npm ci

# Copy source
COPY . .

# Build frontend
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built app
COPY --from=build /app/server ./server
COPY --from=build /app/client/build ./client/build
COPY --from=build /app/credentials ./credentials

EXPOSE 5000

CMD ["node", "server/index.js"]
```

### .dockerignore

```
node_modules
client/node_modules
client/build
.env
.git
.gitignore
*.md
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - JWT_SECRET=${JWT_SECRET}
      - MASTER_SPREADSHEET_ID=${MASTER_SPREADSHEET_ID}
      - GOOGLE_CREDENTIALS=${GOOGLE_CREDENTIALS}
    restart: unless-stopped
```

### Сборка и запуск

```bash
# Сборка образа
docker build -t 2gis-reviews .

# Запуск контейнера
docker run -d \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your_secret \
  -e MASTER_SPREADSHEET_ID=your_id \
  --name 2gis-reviews \
  2gis-reviews

# Или с docker-compose
docker-compose up -d

# Просмотр логов
docker logs -f 2gis-reviews

# Остановка
docker stop 2gis-reviews

# Удаление
docker rm 2gis-reviews
```

---

## CI/CD с GitHub Actions

### .github/workflows/deploy.yml

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

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          npm ci
          cd client && npm ci

      - name: Run tests
        run: npm test

      - name: Build frontend
        run: cd client && npm run build

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

---

## Мониторинг

### Health Check Endpoint

Добавьте в `server/index.js`:

```javascript
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

### UptimeRobot

1. Зарегистрируйтесь на https://uptimerobot.com/
2. Добавьте новый монитор
3. URL: `https://your-domain.com/health`
4. Интервал: 5 минут

### Sentry (Мониторинг ошибок)

```bash
npm install @sentry/node
```

```javascript
// server/index.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## Backup

### Google Sheets

Google Sheets автоматически сохраняет историю изменений.

Дополнительно можно настроить:

1. Экспорт в Google Drive (через Apps Script)
2. Периодический экспорт в CSV

### База данных (если используете)

```bash
# PostgreSQL backup
pg_dump -U username dbname > backup.sql

# Restore
psql -U username dbname < backup.sql
```

---

## Масштабирование

### Горизонтальное масштабирование

1. **Load Balancer** - распределение нагрузки
2. **Multiple instances** - несколько серверов
3. **Redis** - для сессий и кэша
4. **Message Queue** - для фоновых задач

### Вертикальное масштабирование

1. Увеличение ресурсов сервера (CPU, RAM)
2. Оптимизация кода
3. Кэширование

---

## Чеклист перед деплоем

- [ ] Все тесты проходят
- [ ] Переменные окружения настроены
- [ ] Google Credentials настроены
- [ ] Frontend собран
- [ ] SSL сертификат настроен
- [ ] Мониторинг настроен
- [ ] Backup настроен
- [ ] Документация обновлена
- [ ] Домен настроен
- [ ] Health check работает

---

## Troubleshooting

### Приложение не запускается

1. Проверьте логи: `heroku logs --tail` или `pm2 logs`
2. Проверьте переменные окружения
3. Проверьте порт (должен быть из `process.env.PORT`)

### 502 Bad Gateway

1. Проверьте, что приложение запущено
2. Проверьте Nginx конфигурацию
3. Проверьте firewall

### Ошибки Google Sheets

1. Проверьте credentials
2. Проверьте права доступа к таблице
3. Проверьте квоты API

---

**Удачного деплоя! 🚀**
