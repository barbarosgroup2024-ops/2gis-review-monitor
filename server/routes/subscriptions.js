const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/auth');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получить текущую подписку
router.get('/my', subscriptionController.getMySubscription);

// Активировать подписку (пока без оплаты)
router.post('/activate', subscriptionController.activateSubscription);

// Отменить подписку
router.post('/cancel', subscriptionController.cancelSubscription);

module.exports = router;