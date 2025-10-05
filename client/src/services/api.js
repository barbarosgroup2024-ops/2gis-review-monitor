import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = '/api';

// ==================== COMPANIES ====================

export const getCompanies = async () => {
  const response = await axios.get(`${API_URL}/companies`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getCompany = async (id) => {
  const response = await axios.get(`${API_URL}/companies/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createCompany = async (data) => {
  const response = await axios.post(`${API_URL}/companies`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateCompany = async (id, data) => {
  const response = await axios.put(`${API_URL}/companies/${id}`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await axios.delete(`${API_URL}/companies/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const testConnection = async (id) => {
  const response = await axios.post(`${API_URL}/companies/${id}/test`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// ==================== REVIEWS ====================

export const getReviews = async (companyId, period = 'today') => {
  const response = await axios.get(`${API_URL}/reviews/${companyId}?period=${period}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getStats = async (companyId) => {
  const response = await axios.get(`${API_URL}/reviews/${companyId}/stats`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const refreshReviews = async (companyId) => {
  const response = await axios.post(`${API_URL}/reviews/${companyId}/refresh`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// ==================== SUBSCRIPTIONS ====================

export const getSubscription = async () => {
  const response = await axios.get(`${API_URL}/subscriptions/my`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const activateSubscription = async (plan) => {
  const response = await axios.post(`${API_URL}/subscriptions/activate`, 
    { plan },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await axios.post(`${API_URL}/subscriptions/cancel`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};