import { useEffect, useState, useCallback } from "react";
import { IRestaurantResponse } from "../interfaces/apiResponses";
import RestaurantRepository from "../repository/restaurantRepository";

export const useFetchRestaurants = () => {
  const [restaurants, setRestaurants] = useState<IRestaurantResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await RestaurantRepository.fetchRestaurants();
      console.log(JSON.stringify(response.data, null, 2));
      setRestaurants(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { restaurants, loading, error, refetch: fetchData };
};
