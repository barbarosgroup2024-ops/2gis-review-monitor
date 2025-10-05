const googleSheetsService = require('../services/googleSheets');

// Получить текущую подписку
exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await googleSheetsService.getUserSubscription(req.userId);

    if (!subscription) {
      return res.status(404).json({ error: 'Подписка не найдена' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Ошибка при получении подписки' });
  }
};

// Активировать подписку (пока без оплаты, для тестирования)
exports.activateSubscription = async (req, res) => {
  try {
    const { plan } = req.body; // trial, basic, premium

    if (!['trial', 'basic', 'premium'].includes(plan)) {
      return res.status(400).json({ error: 'Неверный тариф' });
    }

    const currentSubscription = await googleSheetsService.getUserSubscription(req.userId);

    // Определяем длительность подписки
    const duration = plan === 'trial' ? 7 : 30; // дней

    const subscription = {
      userId: req.userId,
      plan,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };

    if (currentSubscription) {
      await googleSheetsService.updateSubscription(req.userId, subscription);
    } else {
      await googleSheetsService.createSubscription(subscription);
    }

    res.json({
      message: 'Подписка активирована',
      subscription
    });
  } catch (error) {
    console.error('Activate subscription error:', error);
    res.status(500).json({ error: 'Ошибка при активации подписки' });
  }
};

// Отменить подписку
exports.cancelSubscription = async (req, res) => {
  try {
    await googleSheetsService.updateSubscription(req.userId, { status: 'cancelled' });

    res.json({ message: 'Подписка отменена' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Ошибка при отмене подписки' });
  }
};