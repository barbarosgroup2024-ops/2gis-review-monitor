const { createClient } = require('@supabase/supabase-js');

// Инициализация Supabase клиента
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ SUPABASE_URL или SUPABASE_SERVICE_KEY не настроены в .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== USERS ====================

async function findUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error;
    }

    if (!data) return null;

    // Возвращаем в формате, совместимом со старым API
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      created: data.created_at,
      status: data.status
    };
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

async function findUserById(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) return null;

    // Возвращаем в формате, совместимом со старым API
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      created: data.created_at,
      status: data.status
    };
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

async function createUser(user) {
  try {
    // Поддержка как старого формата (с id), так и нового (без id)
    const userData = {
      email: user.email,
      password: user.password,
      name: user.name,
      status: user.status || 'active'
    };
    
    // Если передан id, используем его (для совместимости)
    if (user.id) {
      userData.id = user.id;
    }

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Пользователь создан:', user.email);
    
    // Возвращаем в формате, совместимом со старым API
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      created: data.created_at,
      status: data.status
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function updateUser(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Пользователь обновлен:', userId);
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// ==================== SUBSCRIPTIONS ====================

async function getUserSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw error;
  }
}

async function createSubscription(subscription) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: subscription.userId,
        plan: subscription.plan,
        start_date: subscription.startDate,
        end_date: subscription.endDate,
        status: subscription.status || 'active'
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Подписка создана для пользователя:', subscription.userId);
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

async function updateSubscription(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Подписка обновлена:', userId);
    return data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

// ==================== COMPANIES ====================

async function getUserCompanies(userId) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Преобразуем в формат, совместимый со старым API
    return (data || []).map(company => ({
      id: company.id,
      userId: company.user_id,
      companyName: company.company_name,
      twoGisApiUrl: company.two_gis_api_url,
      twoGisProfileUrl: company.two_gis_profile_url,
      telegramBotToken: company.telegram_bot_token,
      telegramChatId: company.telegram_chat_id,
      // Новые поля для единого Telegram бота
      telegramActivationCode: company.telegram_activation_code,
      telegramUserId: company.telegram_user_id,
      telegramUsername: company.telegram_username,
      telegramActivated: company.telegram_activated,
      telegramActivatedAt: company.telegram_activated_at,
      telegramNotificationsEnabled: company.telegram_notifications_enabled,
      checkIntervalMinutes: company.check_interval_minutes,
      minRatingFilter: company.min_rating_filter,
      maxRatingFilter: company.max_rating_filter,
      lastCheckAt: company.last_check_at,
      active: company.active,
      created: company.created_at
    }));
  } catch (error) {
    console.error('Error getting user companies:', error);
    throw error;
  }
}

async function getCompanyById(companyId) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) return null;

    // Преобразуем в формат, совместимый со старым API
    return {
      id: data.id,
      userId: data.user_id,
      companyName: data.company_name,
      twoGisApiUrl: data.two_gis_api_url,
      twoGisProfileUrl: data.two_gis_profile_url,
      telegramBotToken: data.telegram_bot_token,
      telegramChatId: data.telegram_chat_id,
      // Новые поля для единого Telegram бота
      telegramActivationCode: data.telegram_activation_code,
      telegramUserId: data.telegram_user_id,
      telegramUsername: data.telegram_username,
      telegramActivated: data.telegram_activated,
      telegramActivatedAt: data.telegram_activated_at,
      telegramNotificationsEnabled: data.telegram_notifications_enabled,
      checkIntervalMinutes: data.check_interval_minutes,
      minRatingFilter: data.min_rating_filter,
      maxRatingFilter: data.max_rating_filter,
      lastCheckAt: data.last_check_at,
      active: data.active,
      created: data.created_at
    };
  } catch (error) {
    console.error('Error getting company by ID:', error);
    throw error;
  }
}

async function getAllActiveCompanies() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting active companies:', error);
    throw error;
  }
}

async function createCompany(company) {
  try {
    const companyData = {
      user_id: company.userId,
      company_name: company.companyName,
      two_gis_api_url: company.twoGisApiUrl,
      two_gis_profile_url: company.twoGisProfileUrl || null,
      telegram_bot_token: company.telegramBotToken,
      telegram_chat_id: company.telegramChatId,
      active: company.active !== undefined ? company.active : true,
      // Новые поля для единого Telegram бота (будут заполнены миграцией)
      check_interval_minutes: company.checkIntervalMinutes || 5,
      telegram_notifications_enabled: true
    };

    // Если передан id, используем его (для совместимости)
    if (company.id) {
      companyData.id = company.id;
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Компания создана:', company.companyName);
    return data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

async function updateCompany(companyId, updates) {
  try {
    const updateData = {};
    if (updates.companyName !== undefined) updateData.company_name = updates.companyName;
    if (updates.twoGisApiUrl !== undefined) updateData.two_gis_api_url = updates.twoGisApiUrl;
    if (updates.twoGisProfileUrl !== undefined) updateData.two_gis_profile_url = updates.twoGisProfileUrl;
    if (updates.telegramBotToken !== undefined) updateData.telegram_bot_token = updates.telegramBotToken;
    if (updates.telegramChatId !== undefined) updateData.telegram_chat_id = updates.telegramChatId;
    if (updates.active !== undefined) updateData.active = updates.active;
    
    // Новые поля для единого Telegram бота
    if (updates.telegramUserId !== undefined) updateData.telegram_user_id = updates.telegramUserId;
    if (updates.telegramUsername !== undefined) updateData.telegram_username = updates.telegramUsername;
    if (updates.telegramActivated !== undefined) updateData.telegram_activated = updates.telegramActivated;
    if (updates.telegramActivatedAt !== undefined) updateData.telegram_activated_at = updates.telegramActivatedAt;
    if (updates.telegramNotificationsEnabled !== undefined) updateData.telegram_notifications_enabled = updates.telegramNotificationsEnabled;
    if (updates.checkIntervalMinutes !== undefined) updateData.check_interval_minutes = updates.checkIntervalMinutes;
    if (updates.minRatingFilter !== undefined) updateData.min_rating_filter = updates.minRatingFilter;
    if (updates.maxRatingFilter !== undefined) updateData.max_rating_filter = updates.maxRatingFilter;
    if (updates.lastCheckAt !== undefined) updateData.last_check_at = updates.lastCheckAt;

    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Компания обновлена:', companyId);
    return data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
}

async function deleteCompany(companyId) {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (error) throw error;

    console.log('✅ Компания удалена:', companyId);
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
}

// ==================== REVIEWS ====================

async function getCompanyReviews(companyId, period = 'all') {
  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('company_id', companyId)
      .order('date_created', { ascending: false });

    // Фильтрация по периоду
    const now = new Date();
    if (period === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query = query.gte('date_created', today.toISOString());
    } else if (period === 'yesterday') {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query = query.gte('date_created', yesterday.toISOString()).lt('date_created', today.toISOString());
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = query.gte('date_created', weekAgo.toISOString());
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      query = query.gte('date_created', monthAgo.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    // Преобразуем формат для фронтенда
    return (data || []).map(review => ({
      id: review.two_gis_review_id,
      date: review.date_created,
      dateEdited: review.date_edited,
      userName: review.user_name,
      address: review.address,
      rating: review.rating,
      text: review.review_text
    }));
  } catch (error) {
    console.error('Error getting company reviews:', error);
    throw error;
  }
}

async function saveReviewToSheet(companyId, review) {
  try {
    // Преобразуем формат от parseReview в формат БД
    const reviewData = {
      company_id: companyId,
      two_gis_review_id: review.id,
      date_created: review.date || review.date_created,
      date_edited: review.dateEdited || review.date_edited || null,
      user_name: review.userName || review.user_name,
      address: review.address || '',
      rating: review.rating || 0,
      review_text: review.text || review.review_text || '',
      sent_to_telegram: false
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      // Игнорируем ошибку дубликата (отзыв уже существует)
      if (error.code === '23505') {
        console.log('ℹ️ Отзыв уже существует:', review.id);
        return null;
      }
      throw error;
    }

    console.log('✅ Отзыв сохранен:', review.id);
    return data;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
}

async function getReviewStats(companyId) {
  try {
    const { data, error } = await supabase
      .from('review_stats')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || {
      today_count: 0,
      yesterday_count: 0,
      week_count: 0,
      month_count: 0,
      total_count: 0,
      avg_rating: 0
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw error;
  }
}

async function markReviewAsSent(reviewId) {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ sent_to_telegram: true })
      .eq('id', reviewId);

    if (error) throw error;

    console.log('✅ Отзыв отмечен как отправленный:', reviewId);
  } catch (error) {
    console.error('Error marking review as sent:', error);
    throw error;
  }
}

async function getUnsentReviews(companyId) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', companyId)
      .eq('sent_to_telegram', false)
      .order('date_created', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting unsent reviews:', error);
    throw error;
  }
}

// ==================== COMPATIBILITY ====================

/**
 * Заглушка для совместимости с Google Sheets API
 * В Supabase не нужно создавать отдельные таблицы для каждой компании
 * Все отзывы хранятся в одной таблице reviews с company_id
 */
async function createCompanySheet(companyName) {
  // В Supabase не нужно создавать отдельные sheets
  // Возвращаем null, так как sheetId не используется
  console.log('ℹ️ Supabase: createCompanySheet вызван для', companyName, '(не требуется)');
  return null;
}

// Экспорт всех функций
module.exports = {
  supabase, // Экспортируем клиент для прямого использования
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getUserSubscription,
  createSubscription,
  updateSubscription,
  getUserCompanies,
  getCompanyById,
  getAllActiveCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyReviews,
  saveReviewToSheet,
  getReviewStats,
  getReviewsStats: getReviewStats, // Алиас для совместимости с контроллером
  markReviewAsSent,
  getUnsentReviews,
  createCompanySheet // Добавлено для совместимости
};