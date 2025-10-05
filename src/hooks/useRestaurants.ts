import { useEffect, useState } from "react";
import { IRestaurantResponse } from "../interfaces/apiResponses";
import RestaurantRepository from "../repository/restaurantRepository";

export const useFetchRestaurants = () => {
  const [restaurants, setRestaurants] = useState<IRestaurantResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await RestaurantRepository.fetchRestaurants();
        setRestaurants(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { restaurants, loading, error };
};
