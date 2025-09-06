import axios from 'axios';
import {type Station, type NetworkResponse } from '../../globalTypes';

const API_BASE = 'https://api.citybik.es/v2';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stationsService = {
  async getStationsByNetwork(networkId: string): Promise<Station[]> {
    try {
      const response = await apiClient.get<NetworkResponse>(`/networks/${networkId}`);
      return response.data.network.stations || [];
    } catch (error) {
      console.error('Не удалось загрузить данные о станциях', error);
      throw new Error('Не удалось загрузить данные о станциях');
    }
  },

  async getVelobikeMoscowStations(): Promise<Station[]> {
    try {
      const response = await apiClient.get<NetworkResponse>('/networks/velobike-moscow');
      return response.data.network.stations || [];
    } catch (error) {
      console.error('Не удалось загрузить данные о станциях Velobike Moscow', error);
      throw new Error('Не удалось загрузить данные о станциях Velobike Moscow');
    }
  }
};