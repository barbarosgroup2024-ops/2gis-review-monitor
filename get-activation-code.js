require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function getActivationCodes() {
  try {
    console.log('🔍 Получение кодов активации...\n');

    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, company_name, telegram_activation_code, telegram_activated, telegram_username')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Ошибка:', error.message);
      return;
    }

    if (!companies || companies.length === 0) {
      console.log('❌ Компании не найдены. Сначала создайте компанию через веб-интерфейс.');
      return;
    }

    console.log(`📊 Найдено компаний: ${companies.length}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    companies.forEach((company, index) => {
      const status = company.telegram_activated ? '✅ Активирован' : '⏳ Ожидает активации';
      const username = company.telegram_username || 'Не указан';

      console.log(`${index + 1}. ${company.company_name}`);
      console.log(`   Код активации: ${company.telegram_activation_code || 'Не сгенерирован'}`);
      console.log(`   Статус: ${status}`);
      if (company.telegram_activated) {
        console.log(`   Telegram: @${username}`);
      }
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📱 Для активации бота:');
    console.log('   1. Откройте Telegram');
    console.log('   2. Найдите бота: @videokgdas_bot');
    console.log('   3. Отправьте команду: /start КОД_АКТИВАЦИИ');
    console.log('');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

getActivationCodes();