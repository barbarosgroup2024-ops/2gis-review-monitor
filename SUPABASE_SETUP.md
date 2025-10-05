# 🚀 Настройка Supabase для 2GIS Reviews SaaS

## 📋 Что такое Supabase?

Supabase - это open-source альтернатива Firebase, построенная на PostgreSQL. Это дает вам:

- ✅ Реляционную базу данных PostgreSQL
- ✅ Автоматические REST API
- ✅ Realtime подписки
- ✅ Аутентификацию пользователей
- ✅ Хранилище файлов
- ✅ Row Level Security (RLS)

## 🎯 Преимущества Supabase над Google Sheets

| Функция               | Google Sheets         | Supabase                    |
| --------------------- | --------------------- | --------------------------- |
| Скорость              | Медленно (API лимиты) | Быстро (прямые SQL запросы) |
| Масштабируемость      | До ~10,000 строк      | Миллионы записей            |
| Индексы               | Нет                   | Да                          |
| Связи между таблицами | Нет                   | Да (Foreign Keys)           |
| Транзакции            | Нет                   | Да                          |
| Безопасность          | Базовая               | Row Level Security          |
| Стоимость             | Бесплатно             | Бесплатно до 500MB          |

---

## 🚀 Шаг 1: Создание проекта в Supabase

### 1.1 Регистрация

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **"Start your project"**
3. Войдите через GitHub (рекомендуется) или email

### 1.2 Создание проекта

1. Нажмите **"New Project"**
2. Заполните данные:
   - **Name**: `2gis-reviews-saas`
   - **Database Password**: Придумайте надежный пароль (сохраните его!)
   - **Region**: Выберите ближайший регион (например, `Europe (Frankfurt)`)
   - **Pricing Plan**: `Free` (для начала)
3. Нажмите **"Create new project"**
4. Подождите 2-3 минуты, пока проект создается

---

## 🗄️ Шаг 2: Создание схемы базы данных

### 2.1 Открытие SQL Editor

1. В левом меню выберите **"SQL Editor"**
2. Нажмите **"New query"**

### 2.2 Выполнение SQL скрипта

1. Откройте файл `database/schema.sql` в вашем проекте
2. Скопируйте весь SQL код
3. Вставьте в SQL Editor в Supabase
4. Нажмите **"Run"** (или `Ctrl+Enter`)
5. Дождитесь сообщения об успешном выполнении

### 2.3 Проверка таблиц

1. В левом меню выберите **"Table Editor"**
2. Вы должны увидеть 4 таблицы:
   - `users` - пользователи
   - `subscriptions` - подписки
   - `companies` - компании
   - `reviews` - отзывы

---

## 🔑 Шаг 3: Получение API ключей

### 3.1 Найдите настройки проекта

1. В левом меню нажмите на иконку **⚙️ Settings**
2. Выберите **"API"**

### 3.2 Скопируйте ключи

Вам нужны 3 значения:

#### 1. Project URL

```
https://xxxxxxxxxxx.supabase.co
```

#### 2. anon public key

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Это публичный ключ для клиентских приложений.

#### 3. service_role key (⚠️ СЕКРЕТНЫЙ!)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **ВАЖНО**: Этот ключ дает полный доступ к БД. Никогда не публикуйте его!

---

## ⚙️ Шаг 4: Настройка .env файла

### 4.1 Откройте файл `.env`

Найдите секцию Supabase:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4.2 Замените значения

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTYxNjE2MTYsImV4cCI6MTkzMTczNzYxNn0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.3 Отключите Mock Mode

```env
# Mock Mode (для тестирования без Google Sheets)
USE_MOCK_SHEETS=false
```

---

## 🧪 Шаг 5: Тестирование подключения

### 5.1 Перезапустите сервер

```powershell
# Остановите текущий сервер (Ctrl+C)
# Запустите заново
npm run dev:full
```

### 5.2 Проверьте логи

Вы должны увидеть:

```
🚀 Используется Supabase (PostgreSQL)
🚀 Сервер запущен на порту 5000
```

### 5.3 Тестовая регистрация

1. Откройте http://localhost:3000
2. Зарегистрируйте нового пользователя
3. Проверьте в Supabase Table Editor → `users`
4. Вы должны увидеть нового пользователя!

---

## 📊 Шаг 6: Просмотр данных в Supabase

### 6.1 Table Editor

1. **Table Editor** → Просмотр и редактирование данных
2. Выберите таблицу (users, companies, reviews)
3. Можете добавлять/редактировать/удалять записи вручную

### 6.2 SQL Editor

Примеры полезных запросов:

#### Посмотреть всех пользователей

```sql
SELECT * FROM users;
```

#### Посмотреть компании с количеством отзывов

```sql
SELECT
  c.company_name,
  COUNT(r.id) as review_count
FROM companies c
LEFT JOIN reviews r ON r.company_id = c.id
GROUP BY c.id, c.company_name;
```

#### Статистика отзывов за сегодня

```sql
SELECT * FROM review_stats;
```

---

## 🔒 Шаг 7: Настройка Row Level Security (RLS)

RLS уже настроен в `schema.sql`, но вы можете проверить:

### 7.1 Проверка политик

1. **Authentication** → **Policies**
2. Выберите таблицу
3. Вы увидите политики безопасности

### 7.2 Что делают политики?

- Пользователи видят только свои данные
- Пользователи не могут видеть данные других пользователей
- Пользователи могут создавать/редактировать только свои компании
- Пользователи видят отзывы только своих компаний

---

## 🎯 Шаг 8: Миграция данных (если есть)

### Если у вас уже есть данные в Google Sheets:

#### 8.1 Экспорт из Google Sheets

1. Откройте вашу таблицу
2. File → Download → CSV
3. Сохраните каждый лист отдельно

#### 8.2 Импорт в Supabase

1. **Table Editor** → Выберите таблицу
2. Нажмите **"Insert"** → **"Import data from CSV"**
3. Выберите CSV файл
4. Сопоставьте колонки
5. Нажмите **"Import"**

---

## 🚀 Готово!

Теперь ваш проект использует Supabase вместо Google Sheets!

### ✅ Что изменилось:

- ✅ Данные хранятся в PostgreSQL
- ✅ Быстрые запросы с индексами
- ✅ Автоматические связи между таблицами
- ✅ Row Level Security для безопасности
- ✅ Готово к масштабированию

### 📈 Следующие шаги:

1. **Мониторинг**: Dashboard → Usage (следите за лимитами)
2. **Бэкапы**: Database → Backups (автоматические бэкапы)
3. **API Docs**: API → Documentation (автоматическая документация API)

---

## 🆘 Решение проблем

### Ошибка: "Invalid API key"

→ Проверьте, что скопировали правильный ключ из Settings → API

### Ошибка: "relation does not exist"

→ Выполните SQL скрипт из `database/schema.sql`

### Ошибка: "permission denied"

→ Используйте `SUPABASE_SERVICE_KEY`, а не `SUPABASE_ANON_KEY`

### Данные не сохраняются

→ Проверьте логи в Supabase Dashboard → Logs

---

## 📚 Полезные ссылки

- [Документация Supabase](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💰 Лимиты бесплатного плана

| Ресурс       | Лимит     |
| ------------ | --------- |
| Database     | 500 MB    |
| Storage      | 1 GB      |
| Bandwidth    | 2 GB      |
| API Requests | Unlimited |
| Auth Users   | 50,000    |

Для большинства проектов этого более чем достаточно!

---

**Готово! Теперь у вас профессиональная база данных! 🎉**
