import api from './apiClient';

export const fetchDoctors = async (city = '') => {
  const response = await api.get('/doctors', {
    params: city ? { city } : {},
  });
  return response.data;
};

export const fetchDoctorById = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post('/doctors', doctorData);
  return response.data;
};

export const updateDoctor = async (doctorId, doctorData) => {
  const response = await api.put(`/doctors/${doctorId}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  const response = await api.delete(`/doctors/${doctorId}`);
  return response.data;
};
