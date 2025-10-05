const googleSheetsService = require('../services/googleSheets');
const reviewCheckerService = require('../services/reviewChecker');

// Получить отзывы компании
exports.getReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { period = 'today' } = req.query; // today, yesterday, week, month, all

    const company = await googleSheetsService.getCompanyById(companyId);

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Проверка прав доступа
    if (company.userId !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Для Supabase используем companyId, для Google Sheets - sheetId
    const identifier = company.sheetId || companyId;
    const reviews = await googleSheetsService.getCompanyReviews(identifier, period);

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
};

// Получить статистику по отзывам
exports.getStats = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await googleSheetsService.getCompanyById(companyId);

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Проверка прав доступа
    if (company.userId !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Для Supabase используем companyId, для Google Sheets - sheetId
    const identifier = company.sheetId || companyId;
    const stats = await googleSheetsService.getReviewsStats(identifier);

    // Преобразуем формат для фронтенда
    const formattedStats = {
      total: stats.total_count || stats.total || 0,
      today: stats.today_count || stats.today || 0,
      yesterday: stats.yesterday_count || stats.yesterday || 0,
      week: stats.week_count || stats.week || 0,
      month: stats.month_count || stats.month || 0,
      avgRating: stats.avg_rating || stats.avgRating || 0
    };

    res.json(formattedStats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};

// Принудительно обновить отзывы
exports.refreshReviews = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await googleSheetsService.getCompanyById(companyId);

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Проверка прав доступа
    if (company.userId !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const result = await reviewCheckerService.checkCompanyReviews(company);

    res.json({
      message: 'Отзывы обновлены',
      newReviews: result.newReviewsCount
    });
  } catch (error) {
    console.error('Refresh reviews error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении отзывов' });
  }
};