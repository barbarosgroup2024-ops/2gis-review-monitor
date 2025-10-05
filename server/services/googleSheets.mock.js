// Mock версия Google Sheets для тестирования без реального API
// Данные хранятся в памяти

const mockData = {
  users: [],
  subscriptions: [],
  companies: [],
  reviews: {}
};

// ==================== USERS ====================

async function findUserByEmail(email) {
  const user = mockData.users.find(u => u.email === email);
  return user || null;
}

async function findUserById(userId) {
  const user = mockData.users.find(u => u.id === userId);
  return user || null;
}

async function createUser(user) {
  mockData.users.push(user);
  console.log('✅ Mock: Пользователь создан:', user.email);
}

async function updateUser(userId, updates) {
  const userIndex = mockData.users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  mockData.users[userIndex] = { ...mockData.users[userIndex], ...updates };
  console.log('✅ Mock: Пользователь обновлен:', userId);
}

// ==================== SUBSCRIPTIONS ====================

async function getUserSubscription(userId) {
  const subscription = mockData.subscriptions.find(s => s.userId === userId);
  return subscription || null;
}

async function createSubscription(subscription) {
  mockData.subscriptions.push(subscription);
  console.log('✅ Mock: Подписка создана для пользователя:', subscription.userId);
}

async function updateSubscription(userId, updates) {
  const subIndex = mockData.subscriptions.findIndex(s => s.userId === userId);
  if (subIndex === -1) throw new Error('Subscription not found');
  
  mockData.subscriptions[subIndex] = { ...mockData.subscriptions[subIndex], ...updates };
  console.log('✅ Mock: Подписка обновлена:', userId);
}

// ==================== COMPANIES ====================

async function getUserCompanies(userId) {
  return mockData.companies.filter(c => c.userId === userId);
}

async function getCompanyById(companyId) {
  const company = mockData.companies.find(c => c.id === companyId);
  return company || null;
}

async function getAllActiveCompanies() {
  return mockData.companies.filter(c => c.active);
}

async function createCompany(company) {
  mockData.companies.push(company);
  console.log('✅ Mock: Компания создана:', company.companyName);
}

async function updateCompany(companyId, updates) {
  const companyIndex = mockData.companies.findIndex(c => c.id === companyId);
  if (companyIndex === -1) throw new Error('Company not found');
  
  mockData.companies[companyIndex] = { ...mockData.companies[companyIndex], ...updates };
  console.log('✅ Mock: Компания обновлена:', companyId);
}

async function deleteCompany(companyId) {
  const companyIndex = mockData.companies.findIndex(c => c.id === companyId);
  if (companyIndex === -1) throw new Error('Company not found');
  
  mockData.companies.splice(companyIndex, 1);
  console.log('✅ Mock: Компания удалена:', companyId);
}

// ==================== COMPANY SHEETS ====================

async function createCompanySheet(companyName) {
  const sheetId = `mock-sheet-${Date.now()}`;
  mockData.reviews[sheetId] = [];
  console.log('✅ Mock: Таблица создана для компании:', companyName);
  return sheetId;
}

async function getCompanyReviews(sheetId, period = 'all') {
  return mockData.reviews[sheetId] || [];
}

async function saveReviewToSheet(sheetId, review) {
  if (!mockData.reviews[sheetId]) {
    mockData.reviews[sheetId] = [];
  }
  mockData.reviews[sheetId].push(review);
  console.log('✅ Mock: Отзыв сохранен в таблицу:', sheetId);
}

async function getReviewStats(sheetId) {
  const reviews = mockData.reviews[sheetId] || [];
  const now = new Date();
  
  const today = reviews.filter(r => {
    const reviewDate = new Date(r.date);
    return reviewDate.toDateString() === now.toDateString();
  });
  
  const yesterday = reviews.filter(r => {
    const reviewDate = new Date(r.date);
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    return reviewDate.toDateString() === yesterdayDate.toDateString();
  });
  
  const week = reviews.filter(r => {
    const reviewDate = new Date(r.date);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reviewDate >= weekAgo;
  });
  
  const month = reviews.filter(r => {
    const reviewDate = new Date(r.date);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return reviewDate >= monthAgo;
  });
  
  return {
    today: today.length,
    yesterday: yesterday.length,
    week: week.length,
    month: month.length,
    total: reviews.length
  };
}

async function markReviewAsSent(sheetId, reviewId) {
  console.log('✅ Mock: Отзыв отмечен как отправленный:', reviewId);
}

async function getUnsentReviews(sheetId) {
  return mockData.reviews[sheetId] || [];
}

// Экспорт всех функций
module.exports = {
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
  saveReviewToSheet,
  getReviewStats,
  markReviewAsSent,
  getUnsentReviews
};