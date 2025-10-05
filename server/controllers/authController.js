const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const googleSheetsService = require('../services/googleSheets');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Регистрация
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Валидация
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Проверка существующего пользователя
    const existingUser = await googleSheetsService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const userId = uuidv4();
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      created: new Date().toISOString(),
      status: 'active'
    };

    await googleSheetsService.createUser(user);

    // Создание бесплатной пробной подписки на 7 дней
    const subscription = {
      userId,
      plan: 'trial',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };
    await googleSheetsService.createSubscription(subscription);

    // Генерация токена
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        name,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
};

// Вход
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Поиск пользователя
    const user = await googleSheetsService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка статуса
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Аккаунт заблокирован' });
    }

    // Генерация токена
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
};

// Получить текущего пользователя
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await googleSheetsService.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      created: user.created
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
  }
};

// Обновить профиль
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Имя обязательно' });
    }

    await googleSheetsService.updateUser(req.userId, { name });

    const user = await googleSheetsService.findUserById(req.userId);

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
};