import { create } from 'zustand';
import { networksService } from '../services/api/networksService';
import { type Network } from '../globalTypes';

interface NetworksState {
  networks: Network[];
  selectedNetwork: Network | null;
  isLoading: boolean;
  error: string | null;
  fetchNetworks: () => Promise<void>;
  selectNetwork: (networkId: string) => void;
  setSelectedNetwork: (network: Network) => void;
}

export const useNetworksStore = create<NetworksState>((set, get) => ({
  networks: [],
  selectedNetwork: null,
  isLoading: false,
  error: null,

  fetchNetworks: async () => {
    set({ isLoading: true, error: null });
    try {
      const networks = await networksService.getAllNetworks();
      set({ networks, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        isLoading: false 
      });
    }
  },

  selectNetwork: (networkId: string) => {
    const network = get().networks.find(n => n.id === networkId) || null;
    set({ selectedNetwork: network });
  },

  setSelectedNetwork: (network: Network) => {
    set({ selectedNetwork: network });
  }
}));