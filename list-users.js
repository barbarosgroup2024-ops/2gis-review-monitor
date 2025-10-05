/**
 * Список всех пользователей в Supabase
 * Запуск: node list-users.js
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

async function listUsers() {
  try {
    console.log('🔍 Получение списка пользователей...\n');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!users || users.length === 0) {
      console.log('📭 Пользователей не найдено');
      console.log('\n💡 Зарегистрируйтесь через интерфейс: http://localhost:3000/register');
      return;
    }

    console.log(`✅ Найдено пользователей: ${users.length}\n`);
    console.log('═'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Статус: ${user.status}`);
      console.log(`   Создан: ${new Date(user.created_at).toLocaleString('ru-RU')}`);
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n💡 Для проверки подписки используйте:');
    console.log(`   node test-user-subscription.js ${users[0].email}`);
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    process.exit(1);
  }
}

listUsers();