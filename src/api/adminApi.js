import api from './apiClient';

export const fetchDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const fetchAdminVisits = async (filters = {}) => {
  const response = await api.get('/admin/visits', { params: filters });
  return response.data;
};

export const fetchUsersForAdmin = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};



export const approveUser = async (userId) => {
  const response = await api.put(`/auth/approve/${userId}`);
  return response.data;
};

export const rejectUser = async (userId) => {
  const response = await api.delete(`/auth/user/${userId}`);
  return response.data;
};

export const toggleUserStatus = async (userId) => {
  const response = await api.put(`/auth/user/${userId}/status`);
  return response.data;
};

export const sendMailToAll = async (payload) => {
  const response = await api.post('/admin/send-mail-all', payload);
  return response.data;
};
