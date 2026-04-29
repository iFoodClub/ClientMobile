import { useState, useEffect } from 'react';
import RestaurantRepository from '../repository/restaurantRepository';
import { IRestaurantResponse } from '../interfaces/apiResponses';
import { useAuthStore } from '../store/authStore';

export const useFavorites = () => {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<IRestaurantResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await RestaurantRepository.fetchFavorites(user.id);
      setFavorites(response.data);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (restaurantId: number) => {
    if (!user?.id || !user?.userType) return;
    try {
      const response = await RestaurantRepository.toggleFavorite(user.id, restaurantId, user.userType as any);
      await fetchFavorites(); // Recarrega a lista
      return response.data.favorited;
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  return { favorites, loading, toggleFavorite, fetchFavorites };
};
