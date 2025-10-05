const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получить отзывы компании
router.get('/:companyId', reviewController.getReviews);

// Получить статистику по отзывам
router.get('/:companyId/stats', reviewController.getStats);

// Принудительно обновить отзывы
router.post('/:companyId/refresh', reviewController.refreshReviews);

module.exports = router;