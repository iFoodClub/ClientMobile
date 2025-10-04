import { create } from "zustand";
import { IRestaurantResponse } from "../interfaces/apiResponses";
import RestaurantRepository from "../repository/restaurantRepository";

type IRestaurantStore = {
  restaurants: IRestaurantResponse[];
  loading: boolean;
  fetchRestaurants: () => Promise<void>;
};

export const useRestaurantStore = create<IRestaurantStore>()((set) => ({
  restaurants: [],
  loading: false,
  fetchRestaurants: async () => {
    try {
      set({ loading: true });
      const response = await RestaurantRepository.fetchRestaurants();
      set({ restaurants: response.data });
    } catch (error) {
      console.error("Erro ao buscar restaurantes:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
