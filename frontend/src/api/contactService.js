import { apiClient } from './axios';

export const contactService = {
  async submitMessage(data) {
    const response = await apiClient.post('/contact', data);

    return response.data;
  },
};
