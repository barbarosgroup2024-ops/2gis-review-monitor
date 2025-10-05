import axios from 'axios';

const API_URL = '/api/auth';
const TOKEN_KEY = 'auth_token';

// Сохранить токен
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Получить токен
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Удалить токен
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Получить заголовки с токеном
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Регистрация
export const register = async (email, password, name) => {
  const response = await axios.post(`${API_URL}/register`, {
    email,
    password,
    name
  });
  
  if (response.data.token) {
    saveToken(response.data.token);
  }
  
  return response.data;
};

// Вход
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    saveToken(response.data.token);
  }
  
  return response.data;
};

// Получить текущего пользователя
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeaders()
  });
  
  return response.data;
};

// Обновить профиль
export const updateProfile = async (name) => {
  const response = await axios.put(`${API_URL}/profile`, 
    { name },
    { headers: getAuthHeaders() }
  );
  
  return response.data;
};