import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Health Check failed:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard');
  return response.data.data;
};

export const getRequests = async () => {
  const response = await api.get('/requests');
  return response.data.data;
};

export const getRequestById = async (id) => {
  const response = await api.get(`/requests/${id}`);
  return response.data.data;
};

export const createRequest = async (data) => {
  const response = await api.post('/requests', data);
  return response.data.data;
};

export const updateRequestStatus = async (id, status) => {
  const response = await api.put(`/requests/${id}/status`, { status });
  return response.data.data;
};

export const assignEmployee = async (id, assignee) => {
  const response = await api.put(`/requests/${id}/assign`, { assignee });
  return response.data.data;
};

export default api;
