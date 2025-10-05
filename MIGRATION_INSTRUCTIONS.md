# 🚀 Инструкция по выполнению миграции

## Проблема

Поля в базе данных созданы, но коды активации не сгенерированы.

## Решение

Выполните SQL запрос вручную через Supabase Dashboard.

---

## 📋 Шаги выполнения:

### 1. Откройте Supabase Dashboard

Перейдите по ссылке: **https://app.supabase.com/project/fxjgmulnkiolxgsrfmry**

### 2. Откройте SQL Editor

- В левом меню найдите раздел **"SQL Editor"**
- Нажмите на него

### 3. Создайте новый запрос

- Нажмите кнопку **"New Query"** (или "+ New query")

### 4. Скопируйте и вставьте SQL

Скопируйте **весь** текст ниже и вставьте в редактор:

```sql
-- Функция для генерации уникального кода активации
CREATE OR REPLACE FUNCTION generate_activation_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Генерируем коды для всех компаний, у которых их еще нет
UPDATE companies
SET telegram_activation_code = generate_activation_code()
WHERE telegram_activation_code IS NULL;

-- Показываем результат
SELECT
  id,
  company_name,
  telegram_activation_code,
  telegram_activated
FROM companies
ORDER BY created_at DESC;
```

### 5. Выполните запрос

- Нажмите кнопку **"Run"** (или нажмите `Ctrl + Enter`)
- Дождитесь выполнения

### 6. Проверьте результат

Вы должны увидеть таблицу с вашими компаниями и сгенерированными кодами активации (например: `ABC12345`).

---

## ✅ После выполнения миграции:

### 1. Перезапустите сервер (если запущен)

```powershell
# Остановите сервер (Ctrl+C в терминале где он запущен)
# Затем запустите снова:
cd "c:\Users\dasta\OneDrive\Документы\2 GIS"
npm run server
```

### 2. Перезапустите клиент (если запущен)

```powershell
# Остановите клиент (Ctrl+C)
# Затем запустите снова:
cd "c:\Users\dasta\OneDrive\Документы\2 GIS\client"
npm start
```

### 3. Откройте браузер

- Перейдите на страницу любой компании
- Вы должны увидеть **желтый блок** с кодом активации
- Нажмите кнопку **"🚀 Открыть бота и активировать"**

---

## 🆘 Если что-то не работает:

### Проблема: Не вижу SQL Editor в Supabase

**Решение:** Убедитесь, что вы вошли в правильный проект (fxjgmulnkiolxgsrfmry)

### Проблема: Ошибка при выполнении SQL

**Решение:** Скопируйте текст ошибки и сообщите мне

### Проблема: Код активации все еще не отображается

**Решение:**

1. Проверьте, что SQL выполнился успешно (должна быть таблица с кодами)
2. Перезапустите сервер и клиент
3. Очистите кэш браузера (Ctrl+Shift+R)

---

## 📞 Нужна помощь?

Напишите мне, и я помогу разобраться!
