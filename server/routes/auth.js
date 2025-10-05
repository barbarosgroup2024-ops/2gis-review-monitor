const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Получить текущего пользователя
router.get('/me', authMiddleware, authController.getCurrentUser);

// Обновить профиль
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;