const { v4: uuidv4 } = require('uuid');
const googleSheetsService = require('../services/googleSheets');
const twoGisService = require('../services/twoGis');
const twoGisUrlBuilder = require('../utils/twoGisUrlBuilder');

// Получить все компании пользователя
exports.getUserCompanies = async (req, res) => {
  try {
    const companies = await googleSheetsService.getUserCompanies(req.userId);
    res.json(companies);
  } catch (error) {
    console.error('Get user companies error:', error);
    res.status(500).json({ error: 'Ошибка при получении списка компаний' });
  }
};

// Получить одну компанию
exports.getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await googleSheetsService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Проверка прав доступа
    if (company.userId !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Ошибка при получении данных компании' });
  }
};

// Создать компанию
exports.createCompany = async (req, res) => {
  try {
    const { companyName, twoGisApiUrl, telegramBotToken, telegramChatId } = req.body;

    // Валидация
    if (!companyName || !twoGisApiUrl) {
      return res.status(400).json({ error: 'Название компании и URL API 2GIS обязательны' });
    }

    // Нормализуем вход: поддерживаем как полный URL, так и просто ID компании
    let normalizedUrl, companyId;
    try {
      const normalized = twoGisUrlBuilder.normalizeInput(twoGisApiUrl);
      normalizedUrl = normalized.url;
      companyId = normalized.companyId;
      
      // Валидируем ID компании
      if (!twoGisUrlBuilder.isValidCompanyId(companyId)) {
        return res.status(400).json({ 
          error: 'Неверный формат ID компании 2GIS',
          details: 'ID должен содержать от 10 до 20 цифр'
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        error: 'Неверный формат URL или ID компании',
        details: error.message
      });
    }

    // Проверка подписки
    const subscription = await googleSheetsService.getUserSubscription(req.userId);
    if (!subscription || subscription.status !== 'active') {
      return res.status(403).json({ error: 'Требуется активная подписка' });
    }

    // Проверка лимита компаний
    const companies = await googleSheetsService.getUserCompanies(req.userId);
    const maxCompanies = subscription.plan === 'trial' ? 1 : subscription.plan === 'basic' ? 3 : 10;
    
    if (companies.length >= maxCompanies) {
      return res.status(403).json({ 
        error: `Достигнут лимит компаний для вашего тарифа (${maxCompanies})` 
      });
    }

    // Создание Google Sheets для отзывов компании (только для Google Sheets режима)
    const sheetId = await googleSheetsService.createCompanySheet(companyName);

    const newCompanyId = uuidv4();
    const company = {
      id: newCompanyId,
      userId: req.userId,
      companyName,
      twoGisApiUrl: normalizedUrl, // Используем нормализованный URL
      twoGisCompanyId: companyId,   // Сохраняем ID компании отдельно
      telegramBotToken: telegramBotToken || '',
      telegramChatId: telegramChatId || '',
      active: true,
      created: new Date().toISOString()
    };

    // sheetId добавляем только если он есть (для Google Sheets)
    if (sheetId) {
      company.sheetId = sheetId;
    }

    await googleSheetsService.createCompany(company);

    res.status(201).json(company);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Ошибка при создании компании' });
  }
};

// Обновить компанию
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, twoGisApiUrl, telegramBotToken, telegramChatId, active } = req.body;

    const company = await googleSheetsService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Проверка прав доступа
    if (company.userId !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const updates = {};
    if (companyName !== undefined) updates.companyName = companyName;
    
    // Если обновляется URL/ID компании, нормализуем его
    if (twoGisApiUrl !== undefined) {
      try {
        const normalized = twoGisUrlBuilder.normalizeInput(twoGisApiUrl);
        updates.twoGisApiUrl = normalized.url;
        updates.twoGisCompanyId = normalized.companyId;
        
        if (!twoGisUrlBuilder.isValidCompanyId(normalized.companyId)) {
          return res.status(400).json({ 
            error: 'Неверный формат ID компании 2GIS',
            details: 'ID должен содержать от 10 до 20 цифр'
          });
        }
      } catch (error) {
        return res.status(400).json({ 
          error: 'Неверный формат URL или ID компании',
          details: error.message
        });
      }
    }
    
    if (telegramBotToken !== undefined) updates.telegramBotToken = telegramBotToken;
    if (telegramChatId !== undefined) updates.telegramChatId = telegramChatId;
    if (active !== undefined) updates.active = active;

    await googleSheetsService.updateCompany(id, updates);

    const updatedCompany = await googleSheetsService.getCompanyById(id);
    res.json(updatedCompany);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении компании' });
  }
};

// Удалить компанию
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await googleSheetsService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Проверка прав доступа
    if (company.userId !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    await googleSheetsService.deleteCompany(id);

    res.json({ message: 'Компания удалена' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Ошибка при удалении компании' });
  }
};

// Тестировать подключение к 2GIS API
exports.testConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await googleSheetsService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Проверка прав доступа
    if (company.userId !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Тестовый запрос к 2GIS API
    const result = await twoGisService.testApiConnection(company.twoGisApiUrl);

    res.json(result);
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ 
      error: 'Ошибка при тестировании подключения',
      details: error.message 
    });
  }
};