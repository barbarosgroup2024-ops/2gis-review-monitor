# 🚀 Скрипт быстрого запуска проекта 2GIS Reviews SaaS

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  2GIS Reviews Monitor - Запуск" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия .env файла
if (-not (Test-Path ".env")) {
    Write-Host "❌ Ошибка: Файл .env не найден!" -ForegroundColor Red
    Write-Host "📝 Создайте файл .env на основе .env.example" -ForegroundColor Yellow
    Write-Host "📖 Смотрите инструкции в START_HERE.md" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Проверка наличия credentials
if (-not (Test-Path "credentials\google-credentials.json")) {
    Write-Host "⚠️  Предупреждение: Файл credentials/google-credentials.json не найден!" -ForegroundColor Yellow
    Write-Host "📖 Следуйте инструкциям в credentials/README.md" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Продолжить запуск? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
}

# Проверка node_modules
Write-Host "🔍 Проверка зависимостей..." -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей backend..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "client\node_modules")) {
    Write-Host "📦 Установка зависимостей frontend..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "✅ Зависимости установлены!" -ForegroundColor Green
Write-Host ""

# Выбор режима запуска
Write-Host "Выберите режим запуска:" -ForegroundColor Cyan
Write-Host "1. Запустить оба сервера (Backend + Frontend)" -ForegroundColor White
Write-Host "2. Запустить только Backend (порт 5000)" -ForegroundColor White
Write-Host "3. Запустить только Frontend (порт 3000)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Ваш выбор (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Запуск обоих серверов..." -ForegroundColor Green
        Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "💻 Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Нажмите Ctrl+C для остановки" -ForegroundColor Yellow
        Write-Host ""
        npm run dev:full
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Запуск Backend..." -ForegroundColor Green
        Write-Host "📡 Сервер: http://localhost:5000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Нажмите Ctrl+C для остановки" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Запуск Frontend..." -ForegroundColor Green
        Write-Host "💻 Приложение: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⚠️  Убедитесь, что Backend запущен на порту 5000!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Нажмите Ctrl+C для остановки" -ForegroundColor Yellow
        Write-Host ""
        npm run client
    }
    default {
        Write-Host "❌ Неверный выбор!" -ForegroundColor Red
        exit 1
    }
}