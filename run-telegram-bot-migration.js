/**
 * Скрипт для запуска миграции "Единый Telegram бот"
 * 
 * Этот скрипт проверяет, нужна ли миграция, и выводит инструкции
 * для ее выполнения в Supabase Dashboard
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Ошибка: SUPABASE_URL или SUPABASE_SERVICE_KEY не найдены в .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMigrationStatus() {
  console.log('🔍 Проверка статуса миграции...\n');

  try {
    // Проверяем, существует ли поле telegram_activation_code
    const { data, error } = await supabase
      .from('companies')
      .select('telegram_activation_code')
      .limit(1);

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('⚠️  Поле telegram_activation_code не найдено - миграция требуется\n');
        return false;
      }
      throw error;
    }

    console.log('✅ Поле telegram_activation_code уже существует\n');
    
    // Проверяем статистику
    const { data: companies, error: statsError } = await supabase
      .from('companies')
      .select('id, company_name, telegram_activation_code, telegram_activated, telegram_user_id');

    if (statsError) throw statsError;

    console.log('📊 Текущая статистика:');
    console.log(`   Всего компаний: ${companies.length}`);
    console.log(`   С кодами активации: ${companies.filter(c => c.telegram_activation_code).length}`);
    console.log(`   Активированных: ${companies.filter(c => c.telegram_activated).length}`);
    console.log('');

    if (companies.length > 0) {
      console.log('📋 Примеры кодов активации:');
      companies.slice(0, 3).forEach(c => {
        console.log(`   ${c.company_name}: ${c.telegram_activation_code || 'не сгенерирован'}`);
      });
      console.log('');
    }

    return true;
  } catch (error) {
    console.error('❌ Ошибка при проверке:', error.message);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Миграция: Единый Telegram бот для всех компаний         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  const migrationExists = await checkMigrationStatus();

  if (migrationExists) {
    console.log('✅ Миграция уже выполнена!');
    console.log('');
    console.log('💡 Для просмотра статуса активации используйте:');
    console.log('   SELECT * FROM telegram_activation_status;');
    console.log('');
    console.log('💡 Для получения компаний, которым пора проверять отзывы:');
    console.log('   SELECT * FROM get_companies_to_check();');
    console.log('');
    return;
  }

  console.log('📝 Для выполнения миграции:');
  console.log('');
  console.log('1️⃣  Откройте Supabase SQL Editor:');
  console.log(`   ${supabaseUrl.replace('//', '//app.')}/project/_/sql`);
  console.log('');
  console.log('2️⃣  Скопируйте содержимое файла:');
  console.log('   database/migrations/unified_telegram_bot.sql');
  console.log('');
  console.log('3️⃣  Вставьте SQL в редактор и нажмите "Run"');
  console.log('');
  console.log('4️⃣  Проверьте результат выполнения');
  console.log('');

  // Читаем и выводим SQL
  const migrationPath = path.join(__dirname, 'database', 'migrations', 'unified_telegram_bot.sql');
  
  if (fs.existsSync(migrationPath)) {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SQL для выполнения:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log(sql);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
  } else {
    console.log('⚠️  Файл миграции не найден:', migrationPath);
  }

  console.log('');
  console.log('📚 Что добавит эта миграция:');
  console.log('');
  console.log('   ✅ Новые поля в таблице companies:');
  console.log('      - two_gis_profile_url (ссылка на профиль компании)');
  console.log('      - telegram_activation_code (уникальный код для активации)');
  console.log('      - telegram_user_id (ID пользователя Telegram)');
  console.log('      - telegram_username (username в Telegram)');
  console.log('      - telegram_activated (статус активации)');
  console.log('      - telegram_activated_at (дата активации)');
  console.log('      - check_interval_minutes (интервал проверки отзывов)');
  console.log('      - min_rating_filter (минимальный рейтинг для отправки)');
  console.log('      - max_rating_filter (максимальный рейтинг для отправки)');
  console.log('      - last_check_at (время последней проверки)');
  console.log('      - telegram_notifications_enabled (включены ли уведомления)');
  console.log('');
  console.log('   ✅ Индексы для оптимизации запросов');
  console.log('');
  console.log('   ✅ Представление telegram_activation_status');
  console.log('      (для просмотра статуса активации всех компаний)');
  console.log('');
  console.log('   ✅ Функция get_companies_to_check()');
  console.log('      (для получения компаний, которым пора проверять отзывы)');
  console.log('');
  console.log('   ✅ Функция generate_activation_code()');
  console.log('      (для генерации уникальных кодов активации)');
  console.log('');
  console.log('   ✅ Автоматическая генерация кодов для существующих компаний');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
}

main().catch(console.error);