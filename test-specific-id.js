/**
 * Тест для проверки конкретного ID компании 2GIS
 */

const { normalizeInput } = require('./server/utils/twoGisUrlBuilder.js');

const testId = '70000001033202845';

console.log('🧪 Тестирование ID:', testId);
console.log('');

try {
  const result = normalizeInput(testId);
  console.log('✅ Нормализация успешна:');
  console.log('   ID компании:', result.companyId);
  console.log('   Построенный URL:', result.url);
  console.log('');
  
  console.log('🔌 Проверяем подключение к API...');
  console.log('');
  
  fetch(result.url)
    .then(response => response.json())
    .then(data => {
      if (data.meta) {
        console.log('✅ API отвечает!');
        console.log('📊 Статистика:');
        console.log('   - Всего отзывов:', data.meta.total_count);
        console.log('   - Получено:', data.reviews?.length || 0);
        console.log('   - Средний рейтинг:', data.meta.org_rating);
        console.log('');
        
        if (data.reviews && data.reviews.length > 0) {
          console.log('📝 Первые 3 отзыва:');
          data.reviews.slice(0, 3).forEach((review, index) => {
            console.log(`   ${index + 1}. ${review.user?.name || 'Аноним'} - ${review.rating}⭐`);
            const text = review.text || 'Без текста';
            console.log(`      ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}`);
            console.log('');
          });
        }
        
        console.log('============================================================');
        console.log('✅ ТЕСТ ПРОЙДЕН! ID компании работает корректно!');
        console.log('');
        console.log('💡 Вывод: Вы можете использовать просто ID компании:');
        console.log(`   ${testId}`);
        console.log('');
        console.log('   Система автоматически построит полный URL API.');
      } else if (data.error) {
        console.log('❌ Ошибка API:', data.error.message || JSON.stringify(data.error));
      } else {
        console.log('❌ Неожиданный ответ API:', JSON.stringify(data, null, 2));
      }
    })
    .catch(error => {
      console.log('❌ Ошибка подключения:', error.message);
      console.log('');
      console.log('Возможные причины:');
      console.log('   - Нет интернет-соединения');
      console.log('   - API 2GIS недоступен');
      console.log('   - Неверный ID компании');
    });
    
} catch (error) {
  console.log('❌ Ошибка при нормализации:', error.message);
  console.log('');
  console.log('Проверьте формат ID компании (должен содержать 10-20 цифр)');
}