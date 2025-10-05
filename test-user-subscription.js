/**
 * Тестовый скрипт для проверки пользователя и подписки
 * Запуск: node test-user-subscription.js <email>
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

if (!email) {
  console.error('❌ Укажите email пользователя');
  console.log('Использование: node test-user-subscription.js <email>');
  process.exit(1);
}

async function checkUserAndSubscription() {
  try {
    console.log('🔍 Поиск пользователя:', email);
    
    // Найти пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        console.error('❌ Пользователь не найден');
        console.log('\n💡 Зарегистрируйтесь через интерфейс: http://localhost:3000/register');
        return false;
      }
      throw userError;
    }

    console.log('✅ Пользователь найден:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Имя:', user.name);
    console.log('   Статус:', user.status);
    console.log('   Создан:', user.created_at);

    // Найти подписку
    console.log('\n🔍 Поиск подписки...');
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError) {
      if (subError.code === 'PGRST116') {
        console.error('❌ Подписка не найдена');
        console.log('\n💡 Создайте подписку:');
        console.log('   1. Войдите в систему: http://localhost:3000/login');
        console.log('   2. Перейдите в раздел "Подписка"');
        console.log('   3. Выберите тариф');
        return false;
      }
      throw subError;
    }

    console.log('✅ Подписка найдена:');
    console.log('   ID:', subscription.id);
    console.log('   Тариф:', subscription.plan);
    console.log('   Статус:', subscription.status);
    console.log('   Начало:', subscription.start_date);
    console.log('   Окончание:', subscription.end_date);

    if (subscription.status !== 'active') {
      console.log('\n⚠️ ВНИМАНИЕ: Подписка не активна!');
      console.log('   Для создания компаний требуется активная подписка');
      return false;
    }

    // Проверить компании
    console.log('\n🔍 Проверка компаний...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id);

    if (companiesError) throw companiesError;

    console.log(`✅ Найдено компаний: ${companies.length}`);
    
    const maxCompanies = subscription.plan === 'trial' ? 1 : subscription.plan === 'basic' ? 3 : 10;
    console.log(`   Лимит для тарифа "${subscription.plan}": ${maxCompanies}`);
    
    if (companies.length >= maxCompanies) {
      console.log('\n⚠️ ВНИМАНИЕ: Достигнут лимит компаний!');
      console.log('   Удалите существующие компании или обновите тариф');
      return false;
    }

    if (companies.length > 0) {
      console.log('\n📋 Список компаний:');
      companies.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.company_name} (${company.active ? 'активна' : 'неактивна'})`);
      });
    }

    console.log('\n✅ ВСЁ ГОТОВО!');
    console.log('🎉 Вы можете создавать компании!');
    
    return true;
  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message);
    return false;
  }
}

checkUserAndSubscription().then(success => {
  process.exit(success ? 0 : 1);
});