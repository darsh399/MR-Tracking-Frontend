import api from '../api/apiClient';

export const completeProfile = async (formData) => {
  const response = await api.post('/profile/complete', formData);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};
