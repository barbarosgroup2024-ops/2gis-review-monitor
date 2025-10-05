/**
 * Список всех компаний в Supabase
 * Запуск: node list-companies.js [email]
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

const email = process.argv[2];

async function listCompanies() {
  try {
    let query = supabase
      .from('companies')
      .select(`
        *,
        users!inner(email, name)
      `)
      .order('created_at', { ascending: false });

    // Если указан email, фильтруем по пользователю
    if (email) {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (!user) {
        console.error('❌ Пользователь не найден:', email);
        return;
      }

      query = query.eq('user_id', user.id);
    }

    const { data: companies, error } = await query;

    if (error) throw error;

    if (!companies || companies.length === 0) {
      console.log('📭 Компаний не найдено');
      console.log('\n💡 Создайте компанию через интерфейс: http://localhost:3000/companies/new');
      return;
    }

    console.log(`✅ Найдено компаний: ${companies.length}\n`);
    console.log('═'.repeat(80));
    
    companies.forEach((company, index) => {
      console.log(`\n${index + 1}. ${company.company_name}`);
      console.log(`   ID: ${company.id}`);
      console.log(`   Владелец: ${company.users.name} (${company.users.email})`);
      console.log(`   Статус: ${company.active ? '✅ Активна' : '❌ Неактивна'}`);
      console.log(`   2GIS API: ${company.two_gis_api_url}`);
      if (company.telegram_bot_token) {
        console.log(`   Telegram: ✅ Настроен`);
      }
      console.log(`   Создана: ${new Date(company.created_at).toLocaleString('ru-RU')}`);
    });
    
    console.log('\n' + '═'.repeat(80));
    
    if (companies.length > 0) {
      console.log('\n💡 Для добавления тестовых отзывов используйте:');
      console.log(`   node add-test-reviews.js ${companies[0].id}`);
      console.log('\n🌐 Открыть компанию в браузере:');
      console.log(`   http://localhost:3000/companies/${companies[0].id}`);
    }
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    process.exit(1);
  }
}

listCompanies();