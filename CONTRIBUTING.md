# Руководство для контрибьюторов

Спасибо за интерес к проекту! Мы рады любому вкладу в развитие системы мониторинга отзывов 2GIS.

## Как внести вклад

### 1. Сообщить об ошибке

Если вы нашли ошибку:

1. Проверьте [Issues](https://github.com/your-repo/issues), возможно она уже сообщена
2. Если нет, создайте новый Issue
3. Используйте шаблон для bug report
4. Укажите:
   - Описание проблемы
   - Шаги для воспроизведения
   - Ожидаемое поведение
   - Фактическое поведение
   - Скриншоты (если применимо)
   - Версия системы
   - ОС и браузер
   - Логи ошибок

### 2. Предложить улучшение

Если у вас есть идея:

1. Проверьте [Issues](https://github.com/your-repo/issues), возможно она уже предложена
2. Создайте новый Issue с тегом "enhancement"
3. Опишите:
   - Какую проблему это решит
   - Как это должно работать
   - Примеры использования
   - Альтернативные решения

### 3. Внести код

#### Процесс

1. **Fork** репозитория
2. **Clone** вашего fork

   ```bash
   git clone https://github.com/your-username/2gis-reviews-saas.git
   cd 2gis-reviews-saas
   ```

3. Создайте **ветку** для вашей фичи

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. Внесите изменения

5. **Commit** изменений

   ```bash
   git commit -m "Add: amazing feature"
   ```

6. **Push** в ваш fork

   ```bash
   git push origin feature/amazing-feature
   ```

7. Создайте **Pull Request**

#### Требования к коду

- Следуйте существующему стилю кода
- Добавьте комментарии для сложной логики
- Обновите документацию при необходимости
- Добавьте тесты для новой функциональности
- Убедитесь, что все тесты проходят
- Проверьте код линтером

## Стандарты кода

### JavaScript/Node.js

```javascript
// ✅ Хорошо
async function getUserCompanies(userId) {
  try {
    const companies = await googleSheetsService.getUserCompanies(userId);
    return companies;
  } catch (error) {
    console.error("Error getting user companies:", error);
    throw error;
  }
}

// ❌ Плохо
function getUserCompanies(userId) {
  return googleSheetsService.getUserCompanies(userId);
}
```

### React

```javascript
// ✅ Хорошо
function CompanyCard({ company, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Удалить ${company.name}?`)) {
      onDelete(company.id);
    }
  };

  return (
    <div className="company-card">
      <h3>{company.name}</h3>
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
}

// ❌ Плохо
function CompanyCard(props) {
  return (
    <div>
      <h3>{props.company.name}</h3>
      <button onClick={() => props.onDelete(props.company.id)}>Удалить</button>
    </div>
  );
}
```

### Именование

- **Переменные и функции**: camelCase

  ```javascript
  const userName = "John";
  function getUserData() {}
  ```

- **Классы и компоненты**: PascalCase

  ```javascript
  class UserService {}
  function UserProfile() {}
  ```

- **Константы**: UPPER_SNAKE_CASE

  ```javascript
  const API_URL = "https://api.example.com";
  const MAX_RETRIES = 3;
  ```

- **Файлы**: kebab-case или camelCase
  ```
  user-service.js
  userService.js
  ```

### Комментарии

```javascript
// ✅ Хорошо - объясняет "почему"
// Используем setTimeout вместо setInterval для предотвращения наложения запросов
setTimeout(checkReviews, 5000);

// ❌ Плохо - объясняет "что" (и так видно из кода)
// Вызываем функцию checkReviews через 5 секунд
setTimeout(checkReviews, 5000);
```

## Commit сообщения

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]

[optional footer]
```

### Типы

- `feat`: Новая функция
- `fix`: Исправление бага
- `docs`: Изменения в документации
- `style`: Форматирование, отсутствующие точки с запятой и т.д.
- `refactor`: Рефакторинг кода
- `test`: Добавление тестов
- `chore`: Обновление зависимостей, конфигурации и т.д.

### Примеры

```bash
feat: add email notifications
fix: resolve issue with duplicate reviews
docs: update setup guide
style: format code with prettier
refactor: extract telegram service
test: add tests for auth controller
chore: update dependencies
```

## Pull Request

### Чеклист

Перед созданием PR убедитесь:

- [ ] Код следует стандартам проекта
- [ ] Все тесты проходят
- [ ] Добавлены новые тесты (если применимо)
- [ ] Документация обновлена
- [ ] Commit сообщения следуют стандарту
- [ ] Нет конфликтов с main веткой
- [ ] PR описание заполнено

### Шаблон PR

```markdown
## Описание

Краткое описание изменений

## Тип изменения

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Как протестировать

Шаги для тестирования изменений

## Скриншоты (если применимо)

Добавьте скриншоты

## Чеклист

- [ ] Код следует стандартам
- [ ] Тесты проходят
- [ ] Документация обновлена
```

## Тестирование

### Запуск тестов

```bash
# Все тесты
npm test

# С покрытием
npm run test:coverage

# Watch mode
npm run test:watch
```

### Написание тестов

```javascript
// Пример unit теста
describe("AuthController", () => {
  describe("register", () => {
    it("should create new user", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
          name: "Test User",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            email: "test@example.com",
          }),
        })
      );
    });
  });
});
```

## Структура проекта

```
2-GIS/
├── server/                 # Backend
│   ├── controllers/       # Контроллеры (бизнес-логика)
│   ├── routes/           # Маршруты API
│   ├── services/         # Сервисы (внешние интеграции)
│   ├── middleware/       # Middleware
│   └── utils/            # Утилиты
├── client/               # Frontend
│   └── src/
│       ├── components/   # React компоненты
│       ├── pages/        # Страницы
│       ├── services/     # API клиенты
│       └── utils/        # Утилиты
└── docs/                 # Документация
```

## Где добавлять код

### Новый API endpoint

1. Создайте route в `server/routes/`
2. Создайте controller в `server/controllers/`
3. Добавьте в `server/index.js`
4. Обновите `API_EXAMPLES.md`

### Новый сервис

1. Создайте файл в `server/services/`
2. Экспортируйте функции
3. Используйте в контроллерах

### Новая страница

1. Создайте компонент в `client/src/pages/`
2. Добавьте route в `client/src/App.js`
3. Добавьте ссылку в навигацию

### Новый компонент

1. Создайте файл в `client/src/components/`
2. Используйте в страницах

## Стиль кода

### Backend

```javascript
// Используйте async/await
async function fetchData() {
  try {
    const data = await api.get("/data");
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Деструктуризация
const { email, password } = req.body;

// Arrow functions для коротких функций
const double = (x) => x * 2;

// Используйте const/let вместо var
const API_URL = "https://api.example.com";
let counter = 0;
```

### Frontend

```javascript
// Функциональные компоненты с хуками
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  return <div>{user?.name}</div>;
}

// Деструктуризация props
function Button({ text, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
```

## Документация

### Комментарии к функциям

```javascript
/**
 * Получает отзывы компании за указанный период
 * @param {string} companyId - ID компании
 * @param {string} period - Период (today, yesterday, week, month, all)
 * @returns {Promise<Array>} Массив отзывов
 * @throws {Error} Если компания не найдена
 */
async function getCompanyReviews(companyId, period = "today") {
  // ...
}
```

### README для новых модулей

Если добавляете новый модуль, создайте README.md с описанием:

- Назначение модуля
- Как использовать
- Примеры
- API (если применимо)

## Вопросы?

Если у вас есть вопросы:

1. Проверьте [FAQ.md](FAQ.md)
2. Проверьте [Issues](https://github.com/your-repo/issues)
3. Создайте новый Issue с тегом "question"
4. Свяжитесь с мейнтейнерами

## Code of Conduct

### Наши стандарты

- Будьте уважительны к другим участникам
- Принимайте конструктивную критику
- Фокусируйтесь на том, что лучше для сообщества
- Проявляйте эмпатию к другим участникам

### Неприемлемое поведение

- Оскорбления и личные атаки
- Троллинг и провокации
- Публикация личной информации других людей
- Любое поведение, которое можно считать неуместным

## Лицензия

Внося вклад в проект, вы соглашаетесь, что ваш код будет лицензирован под [MIT License](LICENSE).

---

**Спасибо за ваш вклад! 🎉**
