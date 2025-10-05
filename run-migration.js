// Скрипт для выполнения SQL миграции в Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Ошибка: SUPABASE_URL или SUPABASE_SERVICE_KEY не найдены в .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Начинаем миграцию базы данных...\n');

    // Читаем SQL файл
    const sqlPath = path.join(__dirname, 'database', 'migrations', 'unified_telegram_bot.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL файл загружен:', sqlPath);
    console.log('📏 Размер:', sqlContent.length, 'символов\n');

    // Разбиваем SQL на отдельные команды
    // Убираем комментарии и пустые строки
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log('📋 Найдено SQL команд:', commands.length, '\n');

    // Выполняем каждую команду
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Пропускаем комментарии и блоки DO
      if (command.startsWith('/*') || command.includes('COMMENT ON')) {
        console.log(`⏭️  Пропускаем команду ${i + 1} (комментарий)`);
        continue;
      }

      try {
        console.log(`⚙️  Выполняем команду ${i + 1}/${commands.length}...`);
        
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: command + ';' 
        });

        if (error) {
          // Игнорируем ошибки "already exists"
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate column')) {
            console.log(`⚠️  Команда ${i + 1}: уже существует (пропускаем)`);
            successCount++;
          } else {
            console.error(`❌ Ошибка в команде ${i + 1}:`, error.message);
            errorCount++;
          }
        } else {
          console.log(`✅ Команда ${i + 1}: успешно`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Исключение в команде ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 РЕЗУЛЬТАТЫ МИГРАЦИИ:');
    console.log('='.repeat(60));
    console.log(`✅ Успешно выполнено: ${successCount}`);
    console.log(`❌ Ошибок: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    // Проверяем, что поля созданы
    console.log('🔍 Проверяем созданные поля...\n');
    
    const { data: companies, error: selectError } = await supabase
      .from('companies')
      .select('id, company_name, telegram_activation_code, telegram_activated')
      .limit(1);

    if (selectError) {
      console.error('❌ Ошибка при проверке:', selectError.message);
      console.log('\n⚠️  ВАЖНО: Миграция не завершена полностью!');
      console.log('Выполните SQL вручную через Supabase Dashboard:\n');
      console.log('1. Откройте https://app.supabase.com');
      console.log('2. Выберите проект');
      console.log('3. Перейдите в SQL Editor');
      console.log('4. Скопируйте содержимое файла unified_telegram_bot.sql');
      console.log('5. Выполните SQL\n');
    } else {
      console.log('✅ Поля успешно созданы!');
      console.log('📋 Пример данных:', companies);
      console.log('\n🎉 Миграция завершена успешно!');
      console.log('\n📝 Следующие шаги:');
      console.log('1. Перезапустите сервер: npm run server');
      console.log('2. Перезапустите клиент: npm start');
      console.log('3. Откройте страницу компании - вы увидите код активации');
    }

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    console.log('\n⚠️  Supabase не поддерживает выполнение произвольного SQL через API.');
    console.log('Выполните миграцию вручную:\n');
    console.log('1. Откройте https://app.supabase.com');
    console.log('2. Выберите ваш проект (fxjgmulnkiolxgsrfmry)');
    console.log('3. Перейдите в раздел "SQL Editor" (слева в меню)');
    console.log('4. Нажмите "New Query"');
    console.log('5. Скопируйте весь текст из файла:');
    console.log('   database/migrations/unified_telegram_bot.sql');
    console.log('6. Вставьте в редактор и нажмите "Run" (или Ctrl+Enter)');
    console.log('\n📄 Путь к файлу:');
    console.log('   c:\\Users\\dasta\\OneDrive\\Документы\\2 GIS\\database\\migrations\\unified_telegram_bot.sql\n');
  }
}

runMigration();