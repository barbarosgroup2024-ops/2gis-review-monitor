/**
 * Добавление тестовых отзывов для компании
 * Запуск: node add-test-reviews.js <companyId>
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ОШИБКА: SUPABASE_URL или SUPABASE_SERVICE_KEY не настроены в .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const companyId = process.argv[2];

if (!companyId) {
  console.error('❌ Укажите ID компании');
  console.log('Использование: node add-test-reviews.js <companyId>');
  console.log('\n💡 Получите ID компании:');
  console.log('   1. Войдите в систему: http://localhost:3000/login');
  console.log('   2. Откройте компанию');
  console.log('   3. ID компании в URL: /companies/<ID>');
  process.exit(1);
}

// Генерация случайной даты за последние N дней
function randomDate(daysAgo) {
  const now = new Date();
  const date = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

// Тестовые отзывы
const testReviews = [
  {
    two_gis_review_id: 'test_' + Date.now() + '_1',
    date_created: randomDate(0), // Сегодня
    user_name: 'Иван Петров',
    address: 'ул. Ленина, 10',
    rating: 5,
    review_text: 'Отличное обслуживание! Всё быстро и качественно. Рекомендую!',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_2',
    date_created: randomDate(0), // Сегодня
    user_name: 'Мария Сидорова',
    address: 'пр. Мира, 25',
    rating: 4,
    review_text: 'Хорошо, но можно было бы быстрее. В целом доволен.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_3',
    date_created: randomDate(1), // Вчера
    user_name: 'Алексей Иванов',
    address: 'ул. Советская, 5',
    rating: 5,
    review_text: 'Супер! Всё понравилось, буду обращаться ещё.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_4',
    date_created: randomDate(3), // 3 дня назад
    user_name: 'Елена Смирнова',
    address: 'ул. Пушкина, 15',
    rating: 3,
    review_text: 'Нормально, но ожидал большего. Цены высоковаты.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_5',
    date_created: randomDate(5), // 5 дней назад
    user_name: 'Дмитрий Козлов',
    address: 'пр. Победы, 30',
    rating: 5,
    review_text: 'Всё отлично! Профессионалы своего дела.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_6',
    date_created: randomDate(7), // Неделю назад
    user_name: 'Ольга Новикова',
    address: 'ул. Гагарина, 8',
    rating: 4,
    review_text: 'Хорошее место, приятный персонал.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_7',
    date_created: randomDate(10), // 10 дней назад
    user_name: 'Сергей Волков',
    address: 'ул. Чехова, 12',
    rating: 5,
    review_text: 'Превосходно! Лучшее, что я видел.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_8',
    date_created: randomDate(15), // 15 дней назад
    user_name: 'Анна Морозова',
    address: 'пр. Ленина, 45',
    rating: 2,
    review_text: 'Не очень. Долго ждал, качество среднее.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_9',
    date_created: randomDate(20), // 20 дней назад
    user_name: 'Павел Соколов',
    address: 'ул. Кирова, 20',
    rating: 5,
    review_text: 'Отлично! Всё на высшем уровне.',
    sent_to_telegram: false
  },
  {
    two_gis_review_id: 'test_' + Date.now() + '_10',
    date_created: randomDate(25), // 25 дней назад
    user_name: 'Татьяна Лебедева',
    address: 'ул. Маяковского, 7',
    rating: 4,
    review_text: 'Хорошо, рекомендую друзьям.',
    sent_to_telegram: false
  }
];

async function addTestReviews() {
  try {
    console.log('🔍 Проверка компании...');
    
    // Проверить, существует ли компания
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError) {
      if (companyError.code === 'PGRST116') {
        console.error('❌ Компания не найдена');
        console.log('\n💡 Получите ID компании:');
        console.log('   1. Войдите в систему: http://localhost:3000/login');
        console.log('   2. Откройте компанию');
        console.log('   3. ID компании в URL: /companies/<ID>');
        return false;
      }
      throw companyError;
    }

    console.log('✅ Компания найдена:', company.company_name);
    console.log('\n📝 Добавление тестовых отзывов...');

    let successCount = 0;
    let skipCount = 0;

    for (const review of testReviews) {
      const reviewData = {
        ...review,
        company_id: companyId
      };

      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);

      if (error) {
        if (error.code === '23505') {
          skipCount++;
          console.log('⏭️  Отзыв уже существует, пропускаем');
        } else {
          console.error('❌ Ошибка:', error.message);
        }
      } else {
        successCount++;
        console.log(`✅ Отзыв добавлен: ${review.user_name} (${review.rating}⭐)`);
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Добавлено отзывов: ${successCount}`);
    if (skipCount > 0) {
      console.log(`⏭️  Пропущено (уже существуют): ${skipCount}`);
    }
    console.log('═'.repeat(60));

    // Показать статистику
    console.log('\n📊 Статистика отзывов:');
    const { data: stats } = await supabase
      .from('review_stats')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (stats) {
      console.log(`   Всего: ${stats.total_count}`);
      console.log(`   Сегодня: ${stats.today_count}`);
      console.log(`   Вчера: ${stats.yesterday_count}`);
      console.log(`   За неделю: ${stats.week_count}`);
      console.log(`   За месяц: ${stats.month_count}`);
      console.log(`   Средний рейтинг: ${stats.avg_rating?.toFixed(1) || 0}`);
    }

    console.log('\n🌐 Откройте компанию в браузере:');
    console.log(`   http://localhost:3000/companies/${companyId}`);
    
    return true;
  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message);
    return false;
  }
}

addTestReviews().then(success => {
  process.exit(success ? 0 : 1);
});