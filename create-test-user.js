/**
 * Создание тестового пользователя с подпиской
 * Запуск: node create-test-user.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ОШИБКА: SUPABASE_URL или SUPABASE_SERVICE_KEY не настроены в .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  try {
    const email = 'test@example.com';
    const password = 'test123456';
    const name = 'Тестовый Пользователь';

    console.log('🔍 Проверка существующего пользователя...');
    
    // Проверить, существует ли пользователь
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('⚠️ Пользователь уже существует:', email);
      console.log('   ID:', existingUser.id);
      
      // Проверить подписку
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', existingUser.id)
        .single();

      if (subscription) {
        console.log('✅ Подписка уже существует');
        console.log('   Тариф:', subscription.plan);
        console.log('   Статус:', subscription.status);
      } else {
        console.log('⚠️ Подписка не найдена, создаём...');
        await createSubscription(existingUser.id);
      }

      console.log('\n✅ Готово!');
      console.log('📧 Email:', email);
      console.log('🔑 Пароль:', password);
      console.log('🌐 Войти: http://localhost:3000/login');
      return;
    }

    console.log('📝 Создание пользователя...');
    
    // Хешировать пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Создать пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: email,
        password: hashedPassword,
        name: name,
        status: 'active'
      }])
      .select()
      .single();

    if (userError) throw userError;

    console.log('✅ Пользователь создан:', email);
    console.log('   ID:', user.id);

    // Создать подписку
    await createSubscription(user.id);

    console.log('\n✅ ТЕСТОВЫЙ ПОЛЬЗОВАТЕЛЬ СОЗДАН!');
    console.log('═'.repeat(60));
    console.log('📧 Email:', email);
    console.log('🔑 Пароль:', password);
    console.log('👤 Имя:', name);
    console.log('═'.repeat(60));
    console.log('\n🌐 Войти: http://localhost:3000/login');
    console.log('💡 Используйте эти данные для входа в систему');
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    process.exit(1);
  }
}

async function createSubscription(userId) {
  console.log('📝 Создание подписки...');
  
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // 30 дней

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .insert([{
      id: uuidv4(),
      user_id: userId,
      plan: 'trial',
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    }])
    .select()
    .single();

  if (subError) throw subError;

  console.log('✅ Подписка создана');
  console.log('   Тариф: trial (1 компания)');
  console.log('   Статус: active');
  console.log('   Действует до:', endDate.toLocaleDateString('ru-RU'));
}

createTestUser();