import restaurantRepository from "../repository/restaurantRepository";

export const useOrders = () => {
  async function getRestaurantOrders(restaurantId: number) {
    try {
      const response = await restaurantRepository.getRestaurantOrders(
        restaurantId
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return { getRestaurantOrders };
};
