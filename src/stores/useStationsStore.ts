import { create } from 'zustand';
import { stationsService } from '../services/api/stationsService';
import { type Station } from '../globalTypes';

interface StationsState {
  allStations: Station[];
  displayedStations: Station[];
  isLoading: boolean;
  error: string | null;
  showOnlyFavorites: boolean;
  currentPage: number;
  hasMore: boolean;
  pageSize: number;
  selectedStation: Station | null;
  allNetworksStations: Station[];
  // Фун-и
  fetchStations: (networkId: string) => Promise<void>;
  fetchVelobikeMoscowStations: () => Promise<void>;
  toggleShowFavorites: () => void;
  loadMoreStations: () => void;
  resetPagination: () => void;
  toggleStationSelection: (station: Station) => void;
  clearSelectedStation: () => void;
  filterStationsByFavorites: (favorites: string[]) => void;
  addStationsToAllNetworks: (stations: Station[]) => void;
}

export const useStationsStore = create<StationsState>((set, get) => ({
  allStations: [],
  displayedStations: [],
  isLoading: false,
  error: null,
  showOnlyFavorites: false,
  currentPage: 1,
  hasMore: true,
  pageSize: 50,
  selectedStation: null,
  allNetworksStations: [],
  
  fetchStations: async (networkId: string) => {
    set({ isLoading: true, error: null, selectedStation: null });
    try {
      const stations = await stationsService.getStationsByNetwork(networkId);
      set(state => ({ 
        allStations: stations,
        displayedStations: stations.slice(0, state.pageSize),
        isLoading: false,
        currentPage: 1,
        hasMore: stations.length > state.pageSize,
        allNetworksStations: [...state.allNetworksStations, ...stations]
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        isLoading: false 
      });
    }
  },
  
  fetchVelobikeMoscowStations: async () => {
    set({ isLoading: true, error: null, selectedStation: null });
    try {
      const stations = await stationsService.getVelobikeMoscowStations();
      set(state => ({ 
        allStations: stations,
        displayedStations: stations.slice(0, state.pageSize),
        isLoading: false,
        currentPage: 1,
        hasMore: stations.length > state.pageSize,
        allNetworksStations: [...state.allNetworksStations, ...stations]
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        isLoading: false 
      });
    }
  },
  
  toggleShowFavorites: () => {
    set({ showOnlyFavorites: !get().showOnlyFavorites, selectedStation: null });
  },
  
  loadMoreStations: () => {
    const { allStations, currentPage, displayedStations, pageSize, showOnlyFavorites, allNetworksStations } = get();
    
    if (get().isLoading) return;
    
    const sourceStations = showOnlyFavorites ? allNetworksStations : allStations;
    
    const nextPage = currentPage + 1;
    const startIndex = currentPage * pageSize;
    const endIndex = nextPage * pageSize;
    const newStations = sourceStations.slice(startIndex, endIndex);
    
    if (newStations.length === 0) {
      set({ hasMore: false });
      return;
    }
    
    set({
      displayedStations: [...displayedStations, ...newStations],
      currentPage: nextPage,
      hasMore: endIndex < sourceStations.length
    });
  },
  
  resetPagination: () => {
    const { allStations, pageSize } = get();
    set({
      currentPage: 1,
      displayedStations: allStations.slice(0, pageSize),
      hasMore: allStations.length > pageSize,
      showOnlyFavorites: false,
      selectedStation: null
    });
  },

  filterStationsByFavorites: (favorites: string[]) => {
    const { allNetworksStations, pageSize, showOnlyFavorites } = get();
    
    if (showOnlyFavorites) {
      const filteredStations = allNetworksStations.filter(station => 
        favorites.includes(station.id)
      );
      set({
        displayedStations: filteredStations.slice(0, pageSize),
        currentPage: 1,
        hasMore: filteredStations.length > pageSize
      });
    }
  },
  
  addStationsToAllNetworks: (stations: Station[]) => {
    set(state => ({
      allNetworksStations: [...state.allNetworksStations, ...stations]
    }));
  },
  
  toggleStationSelection: (station: Station) => {
    const { selectedStation } = get();
    
    // Если нажата на уже выбранную станцию - закрываем
    if (selectedStation && selectedStation.id === station.id) {
      set({ selectedStation: null });
    } else {
      // Иначе открываем новую
      set({ selectedStation: station });
    }
  },
  
  clearSelectedStation: () => {
    set({ selectedStation: null });
  }
}));