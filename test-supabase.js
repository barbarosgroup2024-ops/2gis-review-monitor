/**
 * Тестовый скрипт для проверки подключения к Supabase
 * Запуск: node test-supabase.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔍 Проверка подключения к Supabase...\n');
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_SERVICE_KEY:', supabaseKey ? '✅ Установлен' : '❌ Не установлен');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ОШИБКА: SUPABASE_URL или SUPABASE_SERVICE_KEY не настроены в .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('1️⃣ Проверка таблицы users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('❌ Ошибка при проверке таблицы users:', usersError.message);
      if (usersError.message.includes('relation') && usersError.message.includes('does not exist')) {
        console.error('\n⚠️ ТАБЛИЦА НЕ СУЩЕСТВУЕТ!');
        console.error('📝 Выполните SQL скрипт из файла database/schema.sql в Supabase SQL Editor');
        console.error('👉 https://supabase.com/dashboard/project/_/sql');
      }
      return false;
    }
    console.log('✅ Таблица users существует');

    console.log('\n2️⃣ Проверка таблицы subscriptions...');
    const { data: subs, error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);

    if (subsError) {
      console.error('❌ Ошибка при проверке таблицы subscriptions:', subsError.message);
      return false;
    }
    console.log('✅ Таблица subscriptions существует');

    console.log('\n3️⃣ Проверка таблицы companies...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1);

    if (companiesError) {
      console.error('❌ Ошибка при проверке таблицы companies:', companiesError.message);
      return false;
    }
    console.log('✅ Таблица companies существует');

    console.log('\n4️⃣ Проверка таблицы reviews...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);

    if (reviewsError) {
      console.error('❌ Ошибка при проверке таблицы reviews:', reviewsError.message);
      return false;
    }
    console.log('✅ Таблица reviews существует');

    console.log('\n5️⃣ Проверка view review_stats...');
    const { data: stats, error: statsError } = await supabase
      .from('review_stats')
      .select('*')
      .limit(1);

    if (statsError) {
      console.error('❌ Ошибка при проверке view review_stats:', statsError.message);
      return false;
    }
    console.log('✅ View review_stats существует');

    console.log('\n✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!');
    console.log('🎉 Supabase настроен правильно и готов к использованию!');
    
    return true;
  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});