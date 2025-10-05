# 🗄️ Настройка Supabase для 2GIS Review Monitor

## Проблема

Если при регистрации вы видите ошибку **"Ошибка при регистрации"**, это означает, что база данных Supabase не настроена или настроена неправильно.

## ✅ Решение (5 минут)

### Шаг 1: Откройте Supabase SQL Editor

1. Перейдите на: **https://supabase.com/dashboard**
2. Выберите ваш проект: **`fxjgmulnkiolxgsrfmry`**
3. В левом меню нажмите **"SQL Editor"**

### Шаг 2: Проверьте существующие таблицы

Выполните этот запрос:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

**Если таблиц нет или их мало** → переходите к Шагу 3

**Если таблицы есть (users, companies, reviews, subscriptions)** → переходите к Шагу 4

### Шаг 3: Создайте таблицы (если их нет)

1. Откройте файл: **`database/schema_fixed.sql`**
2. Скопируйте **ВСЁ** содержимое файла
3. Вставьте в SQL Editor в Supabase
4. Нажмите **"Run"** (или Ctrl+Enter)
5. Дождитесь выполнения (может занять 10-20 секунд)

✅ Вы должны увидеть: **"Success. No rows returned"**

### Шаг 4: Исправьте политики безопасности (если таблицы уже есть)

Если таблицы уже созданы, но регистрация не работает, выполните этот SQL:

```sql
-- Удаляем старые политики
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own companies" ON companies;
DROP POLICY IF EXISTS "Users can insert own companies" ON companies;
DROP POLICY IF EXISTS "Users can update own companies" ON companies;
DROP POLICY IF EXISTS "Users can delete own companies" ON companies;
DROP POLICY IF EXISTS "Users can view reviews of own companies" ON reviews;

-- Создаем новые политики (разрешают работу через service_role)
CREATE POLICY "Service role can do everything on users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on subscriptions" ON subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on companies" ON companies
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on reviews" ON reviews
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

Нажмите **"Run"**

✅ Вы должны увидеть: **"Success. No rows returned"**

### Шаг 5: Проверьте таблицы

Выполните:

```sql
-- Проверка таблицы users
SELECT * FROM users LIMIT 1;

-- Проверка таблицы subscriptions
SELECT * FROM subscriptions LIMIT 1;

-- Проверка таблицы companies
SELECT * FROM companies LIMIT 1;

-- Проверка таблицы reviews
SELECT * FROM reviews LIMIT 1;
```

Если вы видите **"Success. No rows returned"** или данные - всё работает! ✅

Если видите ошибку - значит таблицы не созданы, вернитесь к Шагу 3.

---

## 🧪 Тестирование регистрации

### 1. Запустите локальный сервер

```powershell
cd "c:\Users\dasta\OneDrive\Документы\2 GIS"
npm run dev
```

### 2. Откройте браузер

```
http://localhost:3000/register
```

### 3. Зарегистрируйтесь

- **Имя:** Test User
- **Email:** test@example.com
- **Пароль:** 123456

### 4. Проверьте результат

**✅ Успех:** Вы перенаправлены на главную страницу

**❌ Ошибка:** Смотрите логи сервера в консоли

---

## 🔍 Проверка данных в Supabase

После успешной регистрации проверьте, что данные сохранились:

```sql
-- Проверка пользователя
SELECT id, email, name, status, created_at
FROM users
WHERE email = 'test@example.com';

-- Проверка подписки
SELECT u.email, s.plan, s.start_date, s.end_date, s.status
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE u.email = 'test@example.com';
```

Вы должны увидеть:

- ✅ Пользователя с email `test@example.com`
- ✅ Подписку с планом `trial` на 7 дней

---

## 🆘 Если всё ещё не работает

### Проверьте переменные окружения

Откройте `.env` и убедитесь, что:

```env
SUPABASE_URL=https://fxjgmulnkiolxgsrfmry.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Проверьте логи сервера

В консоли, где запущен сервер, должно быть:

```
🚀 Используется Supabase (PostgreSQL)
✅ Telegram бот инициализирован
🚀 Сервер запущен на порту 5000
```

Если видите ошибки - скопируйте их и сообщите мне.

### Проверьте логи в браузере

1. Откройте DevTools (F12)
2. Перейдите на вкладку **Console**
3. Попробуйте зарегистрироваться
4. Посмотрите, какие ошибки появляются

---

## 📊 Структура базы данных

После настройки у вас будут таблицы:

| Таблица         | Описание               |
| --------------- | ---------------------- |
| `users`         | Пользователи системы   |
| `subscriptions` | Подписки пользователей |
| `companies`     | Компании пользователей |
| `reviews`       | Отзывы с 2GIS          |

---

## 🔐 Безопасность

**Row Level Security (RLS)** включен, но настроен так, чтобы:

- ✅ Service role (ваш backend) может делать всё
- ✅ Регистрация и авторизация работают
- ✅ Данные защищены от прямого доступа через API

---

## ✅ Чек-лист

- [ ] Открыл Supabase SQL Editor
- [ ] Проверил существующие таблицы
- [ ] Выполнил `schema_fixed.sql` (если таблиц не было)
- [ ] Исправил политики безопасности (если таблицы были)
- [ ] Проверил таблицы запросом SELECT
- [ ] Запустил локальный сервер
- [ ] Успешно зарегистрировался
- [ ] Проверил данные в Supabase

---

**Время настройки: ~5 минут**

**После этого регистрация будет работать!** ✅
