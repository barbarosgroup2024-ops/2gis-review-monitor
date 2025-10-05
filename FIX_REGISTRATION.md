# 🔧 Исправление ошибки регистрации - СДЕЛАЙТЕ СЕЙЧАС

## Проблема

При регистрации появляется ошибка **"Ошибка при регистрации"**

## Причина

База данных Supabase не настроена или настроена с неправильными политиками безопасности (RLS).

---

## ✅ Решение (5 минут)

### Шаг 1: Откройте Supabase

1. Перейдите: **https://supabase.com/dashboard**
2. Войдите в аккаунт
3. Выберите проект: **`fxjgmulnkiolxgsrfmry`**
4. В левом меню нажмите **"SQL Editor"**

### Шаг 2: Скопируйте SQL код

Откройте файл: **`database/schema_fixed.sql`**

Или скопируйте отсюда:

<details>
<summary>📋 Нажмите, чтобы показать SQL код</summary>

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

</details>

### Шаг 3: Выполните SQL

1. Вставьте скопированный код в SQL Editor
2. Нажмите **"Run"** (или Ctrl+Enter)
3. Дождитесь выполнения

✅ Вы должны увидеть: **"Success. No rows returned"**

### Шаг 4: Проверьте таблицы

Выполните этот запрос:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

Вы должны увидеть таблицы:

- `users`
- `subscriptions`
- `companies`
- `reviews`

**Если таблиц нет** - выполните весь файл `database/schema_fixed.sql`

---

## 🧪 Тестирование

### 1. Откройте приложение

```
http://localhost:3000/register
```

(Если сервер не запущен, запустите: `npm run dev`)

### 2. Зарегистрируйтесь

- **Имя:** Test User
- **Email:** test@example.com
- **Пароль:** 123456

### 3. Результат

**✅ Успех:** Вы перенаправлены на главную страницу

**❌ Ошибка:** Смотрите логи в консоли сервера

---

## 🔍 Проверка в Supabase

После успешной регистрации выполните в SQL Editor:

```sql
SELECT id, email, name, status, created_at
FROM users
WHERE email = 'test@example.com';
```

Вы должны увидеть вашего пользователя! ✅

---

## 📚 Подробная инструкция

Если нужно больше деталей: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

---

## ✅ Чек-лист

- [ ] Открыл Supabase SQL Editor
- [ ] Выполнил SQL для исправления политик
- [ ] Проверил наличие таблиц
- [ ] Зарегистрировался в приложении
- [ ] Проверил данные в Supabase

---

**После этого регистрация будет работать!** 🎉
