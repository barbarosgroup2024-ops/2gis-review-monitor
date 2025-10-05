// Проверяем, какую базу данных использовать
if (process.env.USE_MOCK_SHEETS === 'true') {
  console.log('🔧 Используется MOCK версия (данные в памяти)');
  module.exports = require('./googleSheets.mock');
} else if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  console.log('🚀 Используется Supabase (PostgreSQL)');
  module.exports = require('./supabase');
} else {
  console.log('📊 Используется Google Sheets API');
  
const { google } = require('googleapis');
const path = require('path');

// Инициализация Google Sheets API
const CREDENTIALS_PATH = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './credentials/google-credentials.json';
const MASTER_SPREADSHEET_ID = process.env.MASTER_SPREADSHEET_ID;

let sheets;

async function initializeSheets() {
  if (sheets) return sheets;

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(CREDENTIALS_PATH),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    sheets = google.sheets({ version: 'v4', auth: authClient });
    
    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw error;
  }
}

// ==================== USERS ====================

async function findUserByEmail(email) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Users!A2:F',
  });

  const rows = response.data.values || [];
  const user = rows.find(row => row[1] === email);

  if (!user) return null;

  return {
    id: user[0],
    email: user[1],
    password: user[2],
    name: user[3],
    created: user[4],
    status: user[5]
  };
}

async function findUserById(userId) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Users!A2:F',
  });

  const rows = response.data.values || [];
  const user = rows.find(row => row[0] === userId);

  if (!user) return null;

  return {
    id: user[0],
    email: user[1],
    password: user[2],
    name: user[3],
    created: user[4],
    status: user[5]
  };
}

async function createUser(user) {
  const api = await initializeSheets();
  
  await api.spreadsheets.values.append({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Users!A:F',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        user.id,
        user.email,
        user.password,
        user.name,
        user.created,
        user.status
      ]]
    }
  });
}

async function updateUser(userId, updates) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Users!A2:F',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === userId);

  if (rowIndex === -1) throw new Error('User not found');

  const user = rows[rowIndex];
  if (updates.name) user[3] = updates.name;
  if (updates.status) user[5] = updates.status;

  await api.spreadsheets.values.update({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: `Users!A${rowIndex + 2}:F${rowIndex + 2}`,
    valueInputOption: 'RAW',
    resource: {
      values: [user]
    }
  });
}

// ==================== SUBSCRIPTIONS ====================

async function getUserSubscription(userId) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Subscriptions!A2:E',
  });

  const rows = response.data.values || [];
  const subscription = rows.find(row => row[0] === userId);

  if (!subscription) return null;

  return {
    userId: subscription[0],
    plan: subscription[1],
    startDate: subscription[2],
    endDate: subscription[3],
    status: subscription[4]
  };
}

async function createSubscription(subscription) {
  const api = await initializeSheets();
  
  await api.spreadsheets.values.append({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Subscriptions!A:E',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        subscription.userId,
        subscription.plan,
        subscription.startDate,
        subscription.endDate,
        subscription.status
      ]]
    }
  });
}

async function updateSubscription(userId, updates) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Subscriptions!A2:E',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === userId);

  if (rowIndex === -1) throw new Error('Subscription not found');

  const subscription = rows[rowIndex];
  if (updates.plan) subscription[1] = updates.plan;
  if (updates.startDate) subscription[2] = updates.startDate;
  if (updates.endDate) subscription[3] = updates.endDate;
  if (updates.status) subscription[4] = updates.status;

  await api.spreadsheets.values.update({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: `Subscriptions!A${rowIndex + 2}:E${rowIndex + 2}`,
    valueInputOption: 'RAW',
    resource: {
      values: [subscription]
    }
  });
}

// ==================== COMPANIES ====================

async function getUserCompanies(userId) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Companies!A2:I',
  });

  const rows = response.data.values || [];
  const companies = rows
    .filter(row => row[1] === userId)
    .map(row => ({
      id: row[0],
      userId: row[1],
      companyName: row[2],
      twoGisApiUrl: row[3],
      telegramBotToken: row[4],
      telegramChatId: row[5],
      sheetId: row[6],
      active: row[7] === 'true',
      created: row[8]
    }));

  return companies;
}

async function getCompanyById(companyId) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Companies!A2:I',
  });

  const rows = response.data.values || [];
  const company = rows.find(row => row[0] === companyId);

  if (!company) return null;

  return {
    id: company[0],
    userId: company[1],
    companyName: company[2],
    twoGisApiUrl: company[3],
    telegramBotToken: company[4],
    telegramChatId: company[5],
    sheetId: company[6],
    active: company[7] === 'true',
    created: company[8]
  };
}

async function getAllActiveCompanies() {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Companies!A2:I',
  });

  const rows = response.data.values || [];
  const companies = rows
    .filter(row => row[7] === 'true')
    .map(row => ({
      id: row[0],
      userId: row[1],
      companyName: row[2],
      twoGisApiUrl: row[3],
      telegramBotToken: row[4],
      telegramChatId: row[5],
      sheetId: row[6],
      active: true,
      created: row[8]
    }));

  return companies;
}

async function createCompany(company) {
  const api = await initializeSheets();
  
  await api.spreadsheets.values.append({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Companies!A:I',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        company.id,
        company.userId,
        company.companyName,
        company.twoGisApiUrl,
        company.telegramBotToken,
        company.telegramChatId,
        company.sheetId,
        company.active.toString(),
        company.created
      ]]
    }
  });
}

async function updateCompany(companyId, updates) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Companies!A2:I',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === companyId);

  if (rowIndex === -1) throw new Error('Company not found');

  const company = rows[rowIndex];
  if (updates.companyName) company[2] = updates.companyName;
  if (updates.twoGisApiUrl) company[3] = updates.twoGisApiUrl;
  if (updates.telegramBotToken !== undefined) company[4] = updates.telegramBotToken;
  if (updates.telegramChatId !== undefined) company[5] = updates.telegramChatId;
  if (updates.active !== undefined) company[7] = updates.active.toString();

  await api.spreadsheets.values.update({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: `Companies!A${rowIndex + 2}:I${rowIndex + 2}`,
    valueInputOption: 'RAW',
    resource: {
      values: [company]
    }
  });
}

async function deleteCompany(companyId) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    range: 'Companies!A2:I',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === companyId);

  if (rowIndex === -1) throw new Error('Company not found');

  await api.spreadsheets.batchUpdate({
    spreadsheetId: MASTER_SPREADSHEET_ID,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: 0, // ID листа Companies
            dimension: 'ROWS',
            startIndex: rowIndex + 1,
            endIndex: rowIndex + 2
          }
        }
      }]
    }
  });
}

// ==================== COMPANY SHEETS ====================

async function createCompanySheet(companyName) {
  const api = await initializeSheets();
  
  // Создаем новую таблицу для компании
  const response = await api.spreadsheets.create({
    resource: {
      properties: {
        title: `${companyName} - Отзывы 2GIS`
      },
      sheets: [
        { properties: { title: '2GIS' } },
        { properties: { title: 'Сегодня' } },
        { properties: { title: 'Вчера' } },
        { properties: { title: 'Неделя' } },
        { properties: { title: 'Месяц' } },
        { properties: { title: 'Отправлено' } }
      ]
    }
  });

  const sheetId = response.data.spreadsheetId;

  // Добавляем заголовки в лист 2GIS
  await api.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: '2GIS!A1:G1',
    valueInputOption: 'RAW',
    resource: {
      values: [['ID', 'Дата', 'Дата редактирования', 'Имя', 'Адрес', 'Рейтинг', 'Отзыв']]
    }
  });

  return sheetId;
}

async function getCompanyReviews(sheetId, period = 'all') {
  const api = await initializeSheets();
  
  let range = '2GIS!A2:G';
  
  if (period !== 'all') {
    const sheetNames = {
      today: 'Сегодня',
      yesterday: 'Вчера',
      week: 'Неделя',
      month: 'Месяц'
    };
    range = `${sheetNames[period]}!A2:G`;
  }

  const response = await api.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range
  });

  const rows = response.data.values || [];
  
  return rows.map(row => ({
    id: row[0],
    date: row[1],
    dateEdited: row[2],
    userName: row[3],
    address: row[4],
    rating: row[5],
    text: row[6]
  }));
}

async function addReviewToSheet(sheetId, review) {
  const api = await initializeSheets();
  
  await api.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: '2GIS!A:G',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        review.id,
        review.date,
        review.dateEdited,
        review.userName,
        review.address,
        review.rating,
        review.text
      ]]
    }
  });
}

async function getReviewsStats(sheetId) {
  const api = await initializeSheets();
  
  const response = await api.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: '2GIS!A2:G'
  });

  const rows = response.data.values || [];
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(today.getMonth() - 1);

  const stats = {
    total: rows.length,
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
    avgRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };

  let totalRating = 0;

  rows.forEach(row => {
    const date = new Date(row[1]);
    const rating = parseInt(row[5]) || 0;

    if (date >= today) stats.today++;
    if (date >= yesterday && date < today) stats.yesterday++;
    if (date >= weekAgo) stats.week++;
    if (date >= monthAgo) stats.month++;

    if (rating >= 1 && rating <= 5) {
      stats.ratingDistribution[rating]++;
      totalRating += rating;
    }
  });

  stats.avgRating = rows.length > 0 ? (totalRating / rows.length).toFixed(2) : 0;

  return stats;
}

module.exports = {
  initializeSheets,
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
  createCompanySheet,
  getCompanyReviews,
  addReviewToSheet,
  getReviewsStats
};

} // Закрывающая скобка для блока else