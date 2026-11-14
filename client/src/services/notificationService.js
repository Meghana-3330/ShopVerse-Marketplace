import api from './api';

export const getMyNotifications = async (page = 1, limit = 15) => {
  const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};
