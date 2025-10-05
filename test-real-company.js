/**
 * Тест получения отзывов с реального ID компании 2GIS
 */

require('dotenv').config();
const twoGisService = require('./server/services/twoGis');
const twoGisUrlBuilder = require('./server/utils/twoGisUrlBuilder');

// ID компании из вашего примера
// Можно использовать как ID, так и полный URL
const COMPANY_ID = '70000001024523370'; // Из вашего примера URL

console.log('🧪 Тестирование получения отзывов с реального ID компании 2GIS\n');
console.log('=' .repeat(60));

async function testRealCompany() {
  try {
    console.log(`\n📝 ID компании: ${COMPANY_ID}`);
    
    // Нормализуем ID в полный URL
    const normalized = twoGisUrlBuilder.normalizeInput(COMPANY_ID);
    console.log(`✅ Построенный URL: ${normalized.url}\n`);
    
    // Тестируем подключение
    console.log('🔌 Тестирование подключения к 2GIS API...');
    const testResult = await twoGisService.testApiConnection(normalized.url);
    
    if (!testResult.success) {
      console.error('❌ Ошибка подключения:', testResult.error);
      if (testResult.details) {
        console.error('📋 Детали:', testResult.details);
      }
      return;
    }
    
    console.log('✅ Подключение успешно!');
    console.log(`📊 Статистика:`);
    console.log(`   - Всего отзывов: ${testResult.totalCount}`);
    console.log(`   - Получено в ответе: ${testResult.reviewsCount}`);
    console.log(`   - Средний рейтинг: ${testResult.orgRating}`);
    
    // Получаем отзывы
    console.log('\n📥 Получение отзывов...');
    const { reviews, meta } = await twoGisService.fetchReviews(normalized.url);
    
    console.log(`✅ Получено ${reviews.length} отзывов`);
    
    if (reviews.length > 0) {
      console.log('\n📋 Примеры отзывов:\n');
      
      // Показываем первые 3 отзыва
      reviews.slice(0, 3).forEach((review, index) => {
        const parsed = twoGisService.parseReview(review);
        console.log(`${index + 1}. ${parsed.userName} - ${parsed.rating}⭐`);
        console.log(`   Дата: ${parsed.date}`);
        console.log(`   Адрес: ${parsed.address || 'Не указан'}`);
        console.log(`   Текст: ${parsed.text.substring(0, 100)}${parsed.text.length > 100 ? '...' : ''}`);
        console.log('');
      });
      
      // Статистика по рейтингам
      const ratingStats = reviews.reduce((acc, review) => {
        const rating = review.rating || 0;
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Распределение по рейтингам:');
      for (let i = 5; i >= 1; i--) {
        const count = ratingStats[i] || 0;
        const bar = '█'.repeat(Math.floor(count / 2));
        console.log(`   ${i}⭐: ${bar} ${count}`);
      }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ Тест завершен успешно!');
    console.log('\n💡 Вывод: Вы можете использовать как полный URL, так и просто ID компании!');
    console.log('   Примеры:');
    console.log(`   - Просто ID: ${COMPANY_ID}`);
    console.log(`   - Полный URL: ${normalized.url}`);
    
  } catch (error) {
    console.error('\n❌ Ошибка при тестировании:', error.message);
    if (error.response) {
      console.error('📋 Ответ сервера:', error.response.status, error.response.statusText);
      console.error('📋 Данные:', error.response.data);
    }
  }
}

testRealCompany();