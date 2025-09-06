import axios from 'axios';
import { type NetworksResponse, type Network, type NetworkResponse } from '../../globalTypes';

const API_BASE = 'https://api.citybik.es/v2';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    throw new Error(error.response?.data?.message || 'Произошла ошибка при запросе к API');
  }
);

export const networksService = {
  async getAllNetworks(): Promise<Network[]> {
    try {
      const response = await apiClient.get<NetworksResponse>('/networks');
      return response.data.networks;
    } catch (error) {
      console.error('Failed to fetch networks:', error);
      throw new Error('Не удалось загрузить данные о сетях велопроката');
    }
  },

  async getNetworkById(networkId: string): Promise<Network> {
    try {
      const response = await apiClient.get<NetworkResponse>(`/networks/${networkId}`);
      return response.data.network;
    } catch (error) {
      console.error('Failed to fetch network:', error);
      throw new Error('Не удалось загрузить данные о сети велопроката');
    }
  }
};