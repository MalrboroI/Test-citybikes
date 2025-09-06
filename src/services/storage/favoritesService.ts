const FAVORITES_KEY = 'citybikes-favorites';

export const favoritesService = {
  getFavorites(): string[] {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  },

  saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },

  addFavorite(stationId: string): string[] {
    const favorites = this.getFavorites();
    if (!favorites.includes(stationId)) {
      const updatedFavorites = [...favorites, stationId];
      this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    }
    return favorites;
  },

  removeFavorite(stationId: string): string[] {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(id => id !== stationId);
    this.saveFavorites(updatedFavorites);
    return updatedFavorites;
  },

  toggleFavorite(stationId: string): string[] {
    const favorites = this.getFavorites();
    if (favorites.includes(stationId)) {
      return this.removeFavorite(stationId);
    } else {
      return this.addFavorite(stationId);
    }
  }
};