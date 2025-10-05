const TelegramBot = require('node-telegram-bot-api');
const supabaseService = require('./supabase');

// Проверяем, нужно ли запускать бота
const ENABLE_TELEGRAM_BOT = process.env.ENABLE_TELEGRAM_BOT !== 'false';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.warn('⚠️ TELEGRAM_BOT_TOKEN не настроен. Telegram бот отключен.');
}

// Инициализация бота
const bot = process.env.TELEGRAM_BOT_TOKEN && ENABLE_TELEGRAM_BOT
  ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
  : null;

if (bot) {
  console.log('🤖 Telegram бот запущен и ожидает команд...');
} else {
  console.log('⏸ Telegram бот отключен (ENABLE_TELEGRAM_BOT=false или токен не настроен)');
}

// ============================================================
// Обработчик команды /start CODE
// ============================================================
if (bot) {
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || 'Не указан';
  const activationCode = match[1]?.trim().toUpperCase();

  console.log(`📱 /start от пользователя ${userId} (${username}), код: ${activationCode || 'не указан'}`);

  // Если код не указан
  if (!activationCode) {
    await bot.sendMessage(chatId, 
      '❌ <b>Код активации не указан</b>\n\n' +
      'Для активации бота используйте команду:\n' +
      '<code>/start ВАШ_КОД</code>\n\n' +
      'Код активации можно получить в личном кабинете на сайте.',
      { parse_mode: 'HTML' }
    );
    return;
  }

  try {
    // Ищем компанию по коду активации
    const { data: companyData, error } = await supabaseService.supabase
      .from('companies')
      .select('*')
      .eq('telegram_activation_code', activationCode)
      .single();

    if (error || !companyData) {
      console.log(`❌ Код не найден: ${activationCode}`, error);
      await bot.sendMessage(chatId,
        '❌ <b>Неверный код активации</b>\n\n' +
        'Проверьте правильность кода и попробуйте снова.\n' +
        'Код можно найти в личном кабинете.',
        { parse_mode: 'HTML' }
      );
      return;
    }

    console.log(`✅ Компания найдена: ${companyData.company_name} (${companyData.id})`);

    // Проверяем, не активирован ли уже бот для другого пользователя
    if (companyData.telegram_activated && companyData.telegram_user_id !== userId.toString()) {
      console.log(`⚠️ Бот уже активирован для другого пользователя: ${companyData.telegram_user_id}`);
      await bot.sendMessage(chatId,
        '⚠️ <b>Бот уже активирован</b>\n\n' +
        `Этот бот уже активирован для компании "${companyData.company_name}" другим пользователем.\n\n` +
        'Если это ваша компания, обратитесь в поддержку.',
        { parse_mode: 'HTML' }
      );
      return;
    }

    // Активируем бота
    console.log(`🔄 Активация бота для компании ${companyData.id}...`);
    const { error: updateError } = await supabaseService.supabase
      .from('companies')
      .update({
        telegram_activated: true,
        telegram_activated_at: new Date().toISOString(),
        telegram_user_id: userId.toString(),
        telegram_username: username,
        telegram_notifications_enabled: true
      })
      .eq('id', companyData.id);

    if (updateError) {
      console.error('❌ Ошибка активации:', updateError);
      await bot.sendMessage(chatId,
        '❌ <b>Ошибка активации</b>\n\n' +
        'Произошла ошибка при активации бота. Попробуйте позже.',
        { parse_mode: 'HTML' }
      );
      return;
    }

    // Успешная активация
    await bot.sendMessage(chatId,
      '✅ <b>Бот успешно активирован!</b>\n\n' +
      `🏢 Компания: <b>${companyData.company_name}</b>\n` +
      `⏱ Интервал проверки: ${companyData.check_interval_minutes || 5} минут\n\n` +
      '📬 Теперь вы будете получать уведомления о новых отзывах.\n\n' +
      'Доступные команды:\n' +
      '/status - Статус бота\n' +
      '/stop - Остановить уведомления\n' +
      '/start - Возобновить уведомления\n' +
      '/help - Помощь',
      { parse_mode: 'HTML' }
    );

    console.log(`✅ Бот активирован для компании ${companyData.company_name} (${companyData.id})`);

  } catch (error) {
    console.error('❌ Ошибка при активации (catch):', error);
    console.error('Stack trace:', error.stack);
    await bot.sendMessage(chatId,
      '❌ <b>Произошла ошибка</b>\n\n' +
      'Попробуйте позже или обратитесь в поддержку.',
      { parse_mode: 'HTML' }
    );
  }
});
}

// ============================================================
// Обработчик команды /status
// ============================================================
if (bot) {
bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Ищем компанию пользователя
    const { data: companies, error } = await supabaseService.supabase
      .from('companies')
      .select('*')
      .eq('telegram_user_id', userId.toString())
      .eq('telegram_activated', true);

    if (error || !companies || companies.length === 0) {
      await bot.sendMessage(chatId,
        '❌ <b>Бот не активирован</b>\n\n' +
        'Используйте команду <code>/start КОД</code> для активации.',
        { parse_mode: 'HTML' }
      );
      return;
    }

    // Формируем статус для каждой компании
    let statusMessage = '📊 <b>Статус ваших компаний:</b>\n\n';

    for (const company of companies) {
      const status = company.telegram_notifications_enabled ? '✅ Активен' : '⏸ Приостановлен';
      const lastCheck = company.last_check_at 
        ? new Date(company.last_check_at).toLocaleString('ru-RU')
        : 'Еще не проверялось';

      statusMessage += `🏢 <b>${company.company_name}</b>\n`;
      statusMessage += `   Статус: ${status}\n`;
      statusMessage += `   Интервал: ${company.check_interval_minutes || 5} мин\n`;
      statusMessage += `   Последняя проверка: ${lastCheck}\n`;
      
      if (company.min_rating_filter || company.max_rating_filter) {
        const min = company.min_rating_filter || 1;
        const max = company.max_rating_filter || 5;
        statusMessage += `   Фильтр рейтинга: ${min}-${max} ⭐\n`;
      }
      
      statusMessage += '\n';
    }

    await bot.sendMessage(chatId, statusMessage, { parse_mode: 'HTML' });

  } catch (error) {
    console.error('Ошибка при получении статуса:', error);
    await bot.sendMessage(chatId,
      '❌ Произошла ошибка при получении статуса.',
      { parse_mode: 'HTML' }
    );
  }
});
}

// ============================================================
// Обработчик команды /stop
// ============================================================
if (bot) {
bot.onText(/\/stop/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Отключаем уведомления для всех компаний пользователя
    const { error } = await supabaseService.supabase
      .from('companies')
      .update({ telegram_notifications_enabled: false })
      .eq('telegram_user_id', userId.toString())
      .eq('telegram_activated', true);

    if (error) {
      throw error;
    }

    await bot.sendMessage(chatId,
      '⏸ <b>Уведомления приостановлены</b>\n\n' +
      'Вы больше не будете получать уведомления о новых отзывах.\n\n' +
      'Для возобновления используйте команду <code>/start</code>',
      { parse_mode: 'HTML' }
    );

    console.log(`⏸ Уведомления отключены для пользователя ${userId}`);

  } catch (error) {
    console.error('Ошибка при остановке уведомлений:', error);
    await bot.sendMessage(chatId,
      '❌ Произошла ошибка при остановке уведомлений.',
      { parse_mode: 'HTML' }
    );
  }
});
}

// ============================================================
// Обработчик команды /help
// ============================================================
if (bot) {
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
📖 <b>Помощь по боту</b>

<b>Доступные команды:</b>

/start КОД - Активировать бота с кодом из личного кабинета
/status - Показать статус всех ваших компаний
/stop - Приостановить уведомления
/help - Показать эту справку

<b>Как это работает:</b>

1️⃣ Получите код активации в личном кабинете
2️⃣ Отправьте команду /start с вашим кодом
3️⃣ Бот начнет присылать уведомления о новых отзывах

<b>Настройки:</b>

Интервал проверки, фильтры по рейтингу и другие параметры настраиваются в личном кабинете на сайте.

<b>Поддержка:</b>

Если у вас возникли проблемы, обратитесь в поддержку через личный кабинет.
  `.trim();

  await bot.sendMessage(chatId, helpMessage, { parse_mode: 'HTML' });
});
}

// ============================================================
// Обработчик неизвестных команд
// ============================================================
if (bot) {
bot.on('message', async (msg) => {
  // Игнорируем команды (они обрабатываются выше)
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  // Игнорируем служебные сообщения
  if (msg.new_chat_members || msg.left_chat_member) {
    return;
  }

  const chatId = msg.chat.id;

  await bot.sendMessage(chatId,
    '👋 Привет! Я бот для уведомлений о новых отзывах 2GIS.\n\n' +
    'Используйте команду /help для получения справки.',
    { parse_mode: 'HTML' }
  );
});
}

// ============================================================
// Функция отправки уведомления о новом отзыве
// ============================================================
async function sendReviewNotification(telegramUserId, review, companyName) {
  if (!bot) {
    console.warn('⚠️ Telegram бот отключен, уведомление не отправлено');
    return { success: false, error: 'Bot is disabled' };
  }

  try {
    const stars = '⭐'.repeat(review.rating);
    const date = review.date ? new Date(review.date).toLocaleString('ru-RU') : 'Не указана';

    const message = `
🔔 <b>Новый отзыв!</b>

🏢 <b>${companyName}</b>

📅 Дата: ${date}
👤 Автор: ${review.userName || 'Аноним'}
${stars} Рейтинг: ${review.rating}/5

📝 <b>Текст отзыва:</b>
${review.text || 'Без текста'}
    `.trim();

    await bot.sendMessage(telegramUserId, message, { parse_mode: 'HTML' });
    
    console.log(`✅ Уведомление отправлено пользователю ${telegramUserId}`);
    return { success: true };

  } catch (error) {
    console.error('Ошибка отправки уведомления:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// Обработка ошибок polling
// ============================================================
if (bot) {
bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error.code, error.message);
});
}

// ============================================================
// Экспорт
// ============================================================
module.exports = {
  bot,
  sendReviewNotification
};