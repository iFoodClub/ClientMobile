import { useEffect, useState } from "react";
import { IRestaurantDetailsResponse } from "../interfaces/apiResponses";
import RestaurantRepository from "../repository/restaurantRepository";

type useSelectedRestaurantProps = {
  restaurantId: number | undefined;
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
      if (!restaurantId) {
        setLoading(false);
        return;
      }
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
  }, [restaurantId]);

  return { selectedRestaurant, loading, error };
};
