import { useEffect, useState } from "react";
import RestaurantRepository from "../repository/restaurantRepository";
import { IRestaurantDetailsResponse } from "../interfaces/apiResponses";

type useSelectedRestaurantProps = {
  restaurantId: number;
};

export const useSelectedRestaurant = ({
  restaurantId,
}: useSelectedRestaurantProps) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<IRestaurantDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await RestaurantRepository.fetchSelectedRestaurant(
          restaurantId
        );
        setSelectedRestaurant(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { selectedRestaurant, loading, error };
};
