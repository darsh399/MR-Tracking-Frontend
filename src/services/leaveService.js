import api from '../api/apiClient';

export const applyLeave = async (leaveData) => {
  const response = await api.post('/leave/request', leaveData);
  return response.data;
};

export const fetchLeaveRequests = async () => {
  const response = await api.get('/leave/my-requests');
  return response.data;
};

export const approveLeaveRequest = async (requestId, status) => {
  const response = await api.put(`/leave/request/${requestId}`, { status });
  return response.data;
};
