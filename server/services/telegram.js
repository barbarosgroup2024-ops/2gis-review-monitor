const axios = require('axios');

// Отправка сообщения в Telegram
async function sendMessage(botToken, chatId, message) {
  try {
    if (!botToken || !chatId) {
      console.log('Telegram не настроен для этой компании');
      return { success: false, error: 'Telegram не настроен' };
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }, {
      timeout: 10000
    });

    if (response.data.ok) {
      return { success: true };
    } else {
      return { success: false, error: response.data.description };
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
    return { 
      success: false, 
      error: error.response?.data?.description || error.message 
    };
  }
}

// Форматирование отзыва для Telegram
function formatReviewMessage(review, companyName) {
  const stars = '⭐'.repeat(review.rating);
  
  return `
🏢 <b>${companyName}</b>

📅 Дата: ${formatDateRu(review.date)}
👤 Имя: ${review.userName}
📍 Адрес: ${review.address || 'Не указан'}
${stars} Рейтинг: ${review.rating}/5

📝 <b>Отзыв:</b>
${review.text || 'Без текста'}
  `.trim();
}

// Форматирование даты на русском
function formatDateRu(dateStr) {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Тестирование Telegram бота
async function testBot(botToken, chatId) {
  try {
    const testMessage = '✅ Тестовое сообщение от системы мониторинга отзывов 2GIS';
    const result = await sendMessage(botToken, chatId, testMessage);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendMessage,
  formatReviewMessage,
  testBot
};