const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/auth');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получить все компании пользователя
router.get('/', companyController.getUserCompanies);

// Получить одну компанию
router.get('/:id', companyController.getCompany);

// Создать компанию
router.post('/', companyController.createCompany);

// Обновить компанию
router.put('/:id', companyController.updateCompany);

// Удалить компанию
router.delete('/:id', companyController.deleteCompany);

// Тестировать подключение к 2GIS API
router.post('/:id/test', companyController.testConnection);

module.exports = router;