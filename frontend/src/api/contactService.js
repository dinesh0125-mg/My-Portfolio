import { apiClient } from './axios';

export const contactService = {
  async submitMessage(data) {
    const res = await apiClient.post('/contact', data);
    return res.data;
  },
};
