const axios = require('axios');

// Тестирование подключения к 2GIS API
async function testApiConnection(apiUrl) {
  try {
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      validateStatus: () => true
    });

    if (response.status !== 200) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: response.data
      };
    }

    const data = response.data;

    if (!data.reviews) {
      return {
        success: false,
        error: 'Неверный формат ответа API',
        details: 'Отсутствует поле reviews'
      };
    }

    return {
      success: true,
      message: 'Подключение успешно',
      reviewsCount: data.reviews.length,
      totalCount: data.meta?.total_count || 0,
      orgRating: data.meta?.org_rating || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.response?.data || null
    };
  }
}

// Получить отзывы с 2GIS API
async function fetchReviews(apiUrl) {
  try {
    const response = await axios.get(apiUrl, {
      timeout: 15000
    });

    if (!response.data || !response.data.reviews) {
      throw new Error('Неверный формат ответа API');
    }

    return {
      reviews: response.data.reviews,
      meta: response.data.meta || {}
    };
  } catch (error) {
    console.error('Error fetching reviews from 2GIS:', error.message);
    throw error;
  }
}

// Парсинг отзыва в нужный формат
function parseReview(review) {
  const created = review.date_created ? new Date(review.date_created) : new Date();
  const edited = review.date_edited ? new Date(review.date_edited) : null;

  return {
    id: review.id?.toString() || '',
    date: formatDate(created),
    dateEdited: edited ? formatDate(edited) : '',
    userName: review.user?.name || 'Аноним',
    address: review.object?.address || '',
    rating: review.rating || 0,
    text: review.text || ''
  };
}

// Форматирование даты
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
  testApiConnection,
  fetchReviews,
  parseReview
};