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
  
  fetchStations: (networkId: string) => Promise<void>;
  fetchVelobikeMoscowStations: () => Promise<void>;
  toggleShowFavorites: () => void;
  loadMoreStations: () => void;
  resetPagination: () => void;
  filterStations: (favorites: string[]) => void;
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
  
  fetchStations: async (networkId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stations = await stationsService.getStationsByNetwork(networkId);
      set({ 
        allStations: stations,
        displayedStations: stations.slice(0, 50),
        isLoading: false,
        currentPage: 1,
        hasMore: stations.length > 50
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        isLoading: false 
      });
    }
  },
  
    fetchVelobikeMoscowStations: async () => {
    set({ isLoading: true, error: null });
    try {
      const stations = await stationsService.getVelobikeMoscowStations();
      set({ 
        allStations: stations,
        displayedStations: stations.slice(0, 50),
        isLoading: false,
        currentPage: 1,
        hasMore: stations.length > 50
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        isLoading: false 
      });
    }
  },
  
  
toggleShowFavorites: () => {
    set({ showOnlyFavorites: !get().showOnlyFavorites });
  },
  
  loadMoreStations: () => {
    const { allStations, currentPage, displayedStations, pageSize } = get();
    
    if (get().isLoading) return;
    
    const nextPage = currentPage + 1;
    const startIndex = currentPage * pageSize;
    const endIndex = nextPage * pageSize;
    const newStations = allStations.slice(startIndex, endIndex);
    
    if (newStations.length === 0) {
      set({ hasMore: false });
      return;
    }
    
    set({
      displayedStations: [...displayedStations, ...newStations],
      currentPage: nextPage,
      hasMore: endIndex < allStations.length
    });
  },
  
  resetPagination: () => {
    const { allStations, pageSize } = get();
    set({
      currentPage: 1,
      displayedStations: allStations.slice(0, pageSize),
      hasMore: allStations.length > pageSize,
      showOnlyFavorites: false
    });
  },
  
  filterStations: (favorites: string[]) => {
    const { allStations, showOnlyFavorites, pageSize } = get();
    
    if (showOnlyFavorites) {
      const filteredStations = allStations.filter(station => 
        favorites.includes(station.id)
      );
      set({
        displayedStations: filteredStations.slice(0, pageSize),
        currentPage: 1,
        hasMore: filteredStations.length > pageSize
      });
    } else {
      get().resetPagination();
    }
  }
}));