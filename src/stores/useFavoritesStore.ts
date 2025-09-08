import { create } from 'zustand';
import { favoritesService } from '../services/utils/favoritesService';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (stationId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: favoritesService.getFavorites(),

  toggleFavorite: (stationId: string) => {
    const updatedFavorites = favoritesService.toggleFavorite(stationId);
    set({ favorites: updatedFavorites });
  }
}));