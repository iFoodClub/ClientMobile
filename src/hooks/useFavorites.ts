import { useState, useEffect, useCallback } from 'react';
import RestaurantRepository from '../repository/restaurantRepository';
import { IRestaurantResponse } from '../interfaces/apiResponses';
import { useAuthStore } from '../store/authStore';

export const useFavorites = () => {
  const { user, isCompany } = useAuthStore();
  const [favorites, setFavorites] = useState<IRestaurantResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user?.id || !isCompany) return;
    try {
      setLoading(true);
      const response = await RestaurantRepository.fetchFavorites(user.id);
      setFavorites(response.data);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isCompany]);

  const toggleFavorite = useCallback(async (restaurantId: number) => {
    if (!user?.id || !user?.userType || !isCompany) return;
    try {
      const response = await RestaurantRepository.toggleFavorite(user.id, restaurantId, user.userType as any);
      await fetchFavorites(); // Recarrega a lista
      return response.data.favorited;
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
    }
  }, [user?.id, user?.userType, isCompany, fetchFavorites]);

  useEffect(() => {
    if (isCompany) {
      fetchFavorites();
    }
  }, [fetchFavorites, isCompany]);

  return { favorites, loading, toggleFavorite, fetchFavorites };
};
