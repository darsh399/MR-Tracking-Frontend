import api from './apiClient';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/auth/user/${id}`);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
