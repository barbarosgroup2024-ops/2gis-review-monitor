const googleSheetsService = require('./googleSheets');
const twoGisService = require('./twoGis');
const telegramService = require('./telegram');
const supabase = require('./supabase');

// Проверка отзывов для всех активных компаний
async function checkAllCompanies() {
  try {
    // Получаем компании из Supabase (новая система с единым ботом)
    const { data: supabaseCompanies, error } = await supabase
      .from('companies')
      .select('*')
      .eq('active', true)
      .eq('telegram_activated', true)
      .eq('telegram_notifications_enabled', true)
      .not('telegram_user_id', 'is', null);

    if (error) {
      console.error('Ошибка получения компаний из Supabase:', error);
    }

    // Получаем компании из Google Sheets (старая система)
    let googleCompanies = [];
    try {
      googleCompanies = await googleSheetsService.getAllActiveCompanies();
    } catch (error) {
      console.log('Google Sheets недоступен или не настроен');
    }

    const allCompanies = [
      ...(supabaseCompanies || []).map(c => ({
        ...c,
        source: 'supabase',
        companyName: c.company_name,
        twoGisApiUrl: c.two_gis_api_url,
        telegramUserId: c.telegram_user_id,
        checkIntervalMinutes: c.check_interval_minutes || 5,
        minRatingFilter: c.min_rating_filter,
        maxRatingFilter: c.max_rating_filter,
        lastCheckAt: c.last_check_at
      })),
      ...googleCompanies.map(c => ({ ...c, source: 'google' }))
    ];
    
    console.log(`Найдено ${allCompanies.length} активных компаний (Supabase: ${supabaseCompanies?.length || 0}, Google: ${googleCompanies.length})`);

    for (const company of allCompanies) {
      try {
        // Проверяем, нужно ли проверять эту компанию (для Supabase)
        if (company.source === 'supabase' && company.lastCheckAt) {
          const lastCheck = new Date(company.lastCheckAt);
          const now = new Date();
          const minutesSinceLastCheck = (now - lastCheck) / 1000 / 60;
          
          if (minutesSinceLastCheck < company.checkIntervalMinutes) {
            console.log(`⏭ Пропускаем ${company.companyName} (проверка через ${Math.ceil(company.checkIntervalMinutes - minutesSinceLastCheck)} мин)`);
            continue;
          }
        }

        await checkCompanyReviews(company);
      } catch (error) {
        console.error(`Ошибка при проверке компании ${company.companyName}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error checking all companies:', error);
    throw error;
  }
}

// Проверка отзывов для конкретной компании
async function checkCompanyReviews(company) {
  try {
    console.log(`Проверка отзывов для: ${company.companyName}`);

    // Получаем отзывы с 2GIS API
    const { reviews } = await twoGisService.fetchReviews(company.twoGisApiUrl);

    if (!reviews || reviews.length === 0) {
      console.log(`Нет отзывов для ${company.companyName}`);
      return { newReviewsCount: 0 };
    }

    // Для Supabase используем companyId, для Google Sheets - sheetId
    const identifier = company.sheetId || company.id;

    // Получаем существующие отзывы из БД
    const existingReviews = await googleSheetsService.getCompanyReviews(identifier, 'all');
    const existingIds = new Set(existingReviews.map(r => r.two_gis_review_id || r.id));

    // Фильтруем новые отзывы
    const newReviews = reviews
      .filter(review => !existingIds.has(review.id?.toString()))
      .map(review => twoGisService.parseReview(review));

    if (newReviews.length === 0) {
      console.log(`Новых отзывов нет для ${company.companyName}`);
      return { newReviewsCount: 0 };
    }

    console.log(`Найдено ${newReviews.length} новых отзывов для ${company.companyName}`);

    // Сортируем по дате (свежие сверху)
    newReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Добавляем отзывы в БД
    for (const review of newReviews) {
      if (company.sheetId) {
        // Google Sheets режим
        await googleSheetsService.addReviewToSheet(company.sheetId, review);
      } else {
        // Supabase режим
        await googleSheetsService.saveReviewToSheet(company.id, review);
      }
    }

    // Отправляем уведомления в Telegram
    if (company.source === 'supabase' && company.telegramUserId) {
      // Новая система: единый бот
      const { sendReviewNotification } = require('./telegramBot');
      
      for (const review of newReviews) {
        // Применяем фильтры по рейтингу
        if (company.minRatingFilter && review.rating < company.minRatingFilter) {
          console.log(`⏭ Пропускаем отзыв (рейтинг ${review.rating} < ${company.minRatingFilter})`);
          continue;
        }
        if (company.maxRatingFilter && review.rating > company.maxRatingFilter) {
          console.log(`⏭ Пропускаем отзыв (рейтинг ${review.rating} > ${company.maxRatingFilter})`);
          continue;
        }

        await sendReviewNotification(company.telegramUserId, review, company.companyName);
        await sleep(1000);
      }

      // Обновляем время последней проверки
      await supabase
        .from('companies')
        .update({ last_check_at: new Date().toISOString() })
        .eq('id', company.id);

    } else if (company.telegramBotToken && company.telegramChatId) {
      // Старая система: индивидуальные боты
      for (const review of newReviews) {
        const message = telegramService.formatReviewMessage(review, company.companyName);
        await telegramService.sendMessage(
          company.telegramBotToken,
          company.telegramChatId,
          message
        );
        
        await sleep(1000);
      }
    }

    // Обновляем статистику (только для Google Sheets)
    if (company.sheetId) {
      await updateStatistics(company.sheetId);
    }
    // Для Supabase статистика обновляется автоматически через VIEW

    return { newReviewsCount: newReviews.length };
  } catch (error) {
    console.error(`Error checking company reviews for ${company.companyName}:`, error);
    throw error;
  }
}

// Обновление статистики (аналогично вашему скрипту)
async function updateStatistics(sheetId) {
  try {
    const allReviews = await googleSheetsService.getCompanyReviews(sheetId, 'all');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    const filterByDate = (reviews, start, end) => {
      return reviews.filter(r => {
        const d = new Date(r.date);
        return d >= start && d < end;
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const dataMap = {
      'Сегодня': filterByDate(allReviews, today, new Date(today.getTime() + 24 * 60 * 60 * 1000)),
      'Вчера': filterByDate(allReviews, yesterday, today),
      'Неделя': filterByDate(allReviews, weekAgo, today),
      'Месяц': filterByDate(allReviews, monthAgo, today)
    };

    // Обновляем каждый лист статистики
    const { google } = require('googleapis');
    const sheets = await googleSheetsService.initializeSheets();

    for (const [sheetName, reviews] of Object.entries(dataMap)) {
      // Очищаем лист
      await sheets.spreadsheets.values.clear({
        spreadsheetId: sheetId,
        range: `${sheetName}!A:G`
      });

      if (reviews.length === 0) continue;

      // Добавляем заголовки и данные
      const values = [
        ['ID', 'Дата', 'Дата редактирования', 'Имя', 'Адрес', 'Рейтинг', 'Отзыв'],
        ...reviews.map(r => [r.id, r.date, r.dateEdited, r.userName, r.address, r.rating, r.text])
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        resource: { values }
      });
    }

    console.log(`Статистика обновлена для sheetId: ${sheetId}`);
  } catch (error) {
    console.error('Error updating statistics:', error);
  }
}

// Вспомогательная функция задержки
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  checkAllCompanies,
  checkCompanyReviews
};