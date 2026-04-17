import api from './apiClient';

export const addVisit = async (visitData) => {
  const response = await api.post('/visits', visitData);
  return response.data;
};

export const getVisitHistory = async (filters = {}) => {
  const response = await api.get('/visits/history', { params: filters });
  return response.data;
};
