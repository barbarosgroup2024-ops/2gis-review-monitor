/**
 * Тест парсинга ID компании из разных форматов
 */

const twoGisUrlBuilder = require('./server/utils/twoGisUrlBuilder');

console.log('🧪 Тестирование парсинга ID компании 2GIS\n');
console.log('='.repeat(60));

// Тестовые данные
const testCases = [
  {
    name: 'Полный URL с параметрами',
    input: 'https://public-api.reviews.2gis.com/3.0/orgs/70000001024523370/reviews?limit=50&fields=meta.org_rating,meta.org_reviews_count,meta.total_count,reviews.object.address,reviews.hiding_reason&without_my_first_review=false&rated=true&sort_by=friends&key=6e7e1929-4ea9-4a5d-8c05-d601860389bd&locale=ru_KG',
    expectedId: '70000001024523370'
  },
  {
    name: 'Только ID компании',
    input: '70000001033202845',
    expectedId: '70000001033202845'
  },
  {
    name: 'ID с пробелами',
    input: '  70000001033202845  ',
    expectedId: '70000001033202845'
  },
  {
    name: 'Короткий URL без параметров',
    input: 'https://public-api.reviews.2gis.com/3.0/orgs/70000001033202845/reviews',
    expectedId: '70000001033202845'
  },
  {
    name: 'URL без протокола',
    input: 'public-api.reviews.2gis.com/3.0/orgs/12345678901234567/reviews',
    expectedId: '12345678901234567'
  }
];

// Запускаем тесты
let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n📝 Тест ${index + 1}: ${testCase.name}`);
  console.log(`   Вход: ${testCase.input.substring(0, 80)}${testCase.input.length > 80 ? '...' : ''}`);
  
  try {
    const result = twoGisUrlBuilder.normalizeInput(testCase.input);
    
    console.log(`   ✅ ID компании: ${result.companyId}`);
    console.log(`   ✅ Валидность: ${twoGisUrlBuilder.isValidCompanyId(result.companyId) ? 'Да' : 'Нет'}`);
    console.log(`   ✅ Построенный URL: ${result.url.substring(0, 80)}...`);
    
    if (result.companyId === testCase.expectedId) {
      console.log(`   ✅ PASSED - ID совпадает`);
      passed++;
    } else {
      console.log(`   ❌ FAILED - Ожидалось: ${testCase.expectedId}, получено: ${result.companyId}`);
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ FAILED - Ошибка: ${error.message}`);
    failed++;
  }
});

// Тесты на ошибки
console.log('\n' + '='.repeat(60));
console.log('\n🚨 Тестирование обработки ошибок\n');

const errorCases = [
  {
    name: 'Пустая строка',
    input: ''
  },
  {
    name: 'Неверный формат URL',
    input: 'https://example.com/some/path'
  },
  {
    name: 'Буквы вместо цифр',
    input: 'abcdefghijklmnop'
  },
  {
    name: 'Слишком короткий ID',
    input: '123'
  }
];

errorCases.forEach((testCase, index) => {
  console.log(`\n📝 Тест ошибки ${index + 1}: ${testCase.name}`);
  console.log(`   Вход: "${testCase.input}"`);
  
  try {
    const result = twoGisUrlBuilder.normalizeInput(testCase.input);
    console.log(`   ❌ FAILED - Должна была быть ошибка, но получен результат: ${result.companyId}`);
    failed++;
  } catch (error) {
    console.log(`   ✅ PASSED - Корректно выброшена ошибка: ${error.message}`);
    passed++;
  }
});

// Итоги
console.log('\n' + '='.repeat(60));
console.log('\n📊 Результаты тестирования:\n');
console.log(`   ✅ Пройдено: ${passed}`);
console.log(`   ❌ Провалено: ${failed}`);
console.log(`   📈 Всего: ${passed + failed}`);
console.log(`   🎯 Успешность: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 Все тесты пройдены успешно!');
} else {
  console.log('\n⚠️  Некоторые тесты провалены. Проверьте код.');
}

console.log('\n' + '='.repeat(60));

// Демонстрация использования
console.log('\n💡 Примеры использования:\n');

const examples = [
  '70000001033202845',
  'https://public-api.reviews.2gis.com/3.0/orgs/70000001024523370/reviews?limit=50&key=xxx'
];

examples.forEach(example => {
  try {
    const result = twoGisUrlBuilder.normalizeInput(example);
    console.log(`Вход: ${example.substring(0, 50)}${example.length > 50 ? '...' : ''}`);
    console.log(`  → ID: ${result.companyId}`);
    console.log(`  → URL: ${result.url.substring(0, 80)}...`);
    console.log('');
  } catch (error) {
    console.log(`Ошибка: ${error.message}\n`);
  }
});