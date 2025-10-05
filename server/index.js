require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const reviewRoutes = require('./routes/reviews');
const subscriptionRoutes = require('./routes/subscriptions');

// Services
const reviewCheckerService = require('./services/reviewChecker');

// Telegram Bot (запускается автоматически при импорте)
if (process.env.TELEGRAM_BOT_TOKEN) {
  require('./services/telegramBot');
  console.log('✅ Telegram бот инициализирован');
} else {
  console.warn('⚠️  TELEGRAM_BOT_TOKEN не найден в .env - бот не запущен');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // All other GET requests not handled before will return our React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Cron job для проверки новых отзывов
// Запускается каждые 5 минут
const schedule = process.env.REVIEW_CHECK_SCHEDULE || '*/5 * * * *';
cron.schedule(schedule, async () => {
  console.log('🔄 Запуск проверки новых отзывов...');
  try {
    await reviewCheckerService.checkAllCompanies();
    console.log('✅ Проверка завершена');
  } catch (error) {
    console.error('❌ Ошибка при проверке отзывов:', error.message);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📅 Проверка отзывов по расписанию: ${schedule}`);
  console.log(`🌍 Окружение: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;