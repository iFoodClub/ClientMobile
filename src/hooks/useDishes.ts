import { useCallback, useEffect, useState } from "react"; // 1. Importe o useCallback
import { IDishesResponse } from "../interfaces/apiResponses";
import DishRepository from "../repository/dishRepository";

export const useDishes = (restaurantId: number | undefined) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dishes, setDishes] = useState<IDishesResponse[]>([]);

  const fetchDishes = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await DishRepository.fetchDishesByRestaurantId(
        restaurantId
      );
      setDishes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  return { dishes, loading, fetchDishes };
};
