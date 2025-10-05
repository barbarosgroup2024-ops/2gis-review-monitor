/**
 * Утилита для работы с 2GIS API URL
 */

// Константы для 2GIS API
const TWO_GIS_API_BASE = 'https://public-api.reviews.2gis.com/3.0/orgs';
const TWO_GIS_API_KEY = '6e7e1929-4ea9-4a5d-8c05-d601860389bd';
const DEFAULT_LOCALE = 'ru_KG';
const DEFAULT_LIMIT = 50;

/**
 * Проверяет, является ли строка полным URL или просто ID
 * @param {string} input - Входная строка (URL или ID)
 * @returns {boolean} - true если это URL, false если ID
 */
function isFullUrl(input) {
  return input.includes('http://') || input.includes('https://') || input.includes('2gis.com');
}

/**
 * Извлекает ID компании из URL или возвращает ID как есть
 * @param {string} input - URL или ID компании
 * @returns {string} - ID компании
 */
function extractCompanyId(input) {
  if (!input) {
    throw new Error('ID компании или URL не может быть пустым');
  }

  const trimmed = input.trim();

  // Если это уже ID (только цифры)
  if (/^\d+$/.test(trimmed)) {
    // Проверяем длину ID (должен быть от 10 до 20 цифр)
    if (!isValidCompanyId(trimmed)) {
      throw new Error('ID компании должен содержать от 10 до 20 цифр');
    }
    return trimmed;
  }

  // Если это URL, извлекаем ID
  // Формат: https://public-api.reviews.2gis.com/3.0/orgs/70000001024523370/reviews?...
  const match = input.match(/\/orgs\/(\d+)/);
  if (match && match[1]) {
    const extractedId = match[1];
    if (!isValidCompanyId(extractedId)) {
      throw new Error('Извлеченный ID компании имеет неверный формат (должен содержать от 10 до 20 цифр)');
    }
    return extractedId;
  }

  throw new Error('Не удалось извлечь ID компании из URL. Убедитесь, что URL содержит /orgs/{ID}');
}

/**
 * Строит полный URL для 2GIS API из ID компании
 * @param {string} companyId - ID компании (только цифры)
 * @param {object} options - Дополнительные параметры
 * @returns {string} - Полный URL для API
 */
function buildApiUrl(companyId, options = {}) {
  const {
    limit = DEFAULT_LIMIT,
    locale = DEFAULT_LOCALE,
    apiKey = TWO_GIS_API_KEY,
    sortBy = 'friends',
    rated = true,
    withoutMyFirstReview = false
  } = options;

  const params = new URLSearchParams({
    limit: limit.toString(),
    fields: 'meta.org_rating,meta.org_reviews_count,meta.total_count,reviews.object.address,reviews.hiding_reason',
    without_my_first_review: withoutMyFirstReview.toString(),
    rated: rated.toString(),
    sort_by: sortBy,
    key: apiKey,
    locale: locale
  });

  return `${TWO_GIS_API_BASE}/${companyId}/reviews?${params.toString()}`;
}

/**
 * Нормализует вход пользователя в полный API URL
 * @param {string} input - URL или ID компании
 * @param {object} options - Дополнительные параметры для построения URL
 * @returns {object} - { url: string, companyId: string }
 */
function normalizeInput(input, options = {}) {
  if (!input) {
    throw new Error('Необходимо указать ID компании или URL API');
  }

  const trimmedInput = input.trim();

  // Если это полный URL, используем его как есть
  if (isFullUrl(trimmedInput)) {
    const companyId = extractCompanyId(trimmedInput);
    return {
      url: trimmedInput,
      companyId: companyId
    };
  }

  // Если это ID, строим URL
  const companyId = extractCompanyId(trimmedInput);
  const url = buildApiUrl(companyId, options);

  return {
    url: url,
    companyId: companyId
  };
}

/**
 * Валидирует ID компании 2GIS
 * @param {string} companyId - ID компании
 * @returns {boolean} - true если валидный
 */
function isValidCompanyId(companyId) {
  // ID компании 2GIS - это число длиной обычно 17-18 цифр
  return /^\d{10,20}$/.test(companyId);
}

module.exports = {
  isFullUrl,
  extractCompanyId,
  buildApiUrl,
  normalizeInput,
  isValidCompanyId,
  TWO_GIS_API_BASE,
  TWO_GIS_API_KEY,
  DEFAULT_LOCALE,
  DEFAULT_LIMIT
};