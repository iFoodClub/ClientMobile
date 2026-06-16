import { create } from "zustand";
import { IRestaurantDetailsResponse, IRestaurantResponse } from "../interfaces/apiResponses";
import RestaurantRepository from "../repository/restaurantRepository";

type IRestaurantStore = {
  restaurants: IRestaurantResponse[];
  selectedRestaurant: IRestaurantDetailsResponse | null;
  loading: boolean;
  fetchRestaurants: () => Promise<void>;
  fetchSelectedRestaurant: (id: number) => Promise<void>;
  setSelectedRestaurant: (restaurant: IRestaurantDetailsResponse | null) => void;
};

export const useRestaurantStore = create<IRestaurantStore>()((set) => ({
  restaurants: [],
  selectedRestaurant: null,
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
  fetchSelectedRestaurant: async (id: number) => {
    try {
      set({ loading: true });
      const response = await RestaurantRepository.fetchSelectedRestaurant(id);
      set({ selectedRestaurant: response.data });
    } catch (error) {
      console.error("Erro ao buscar restaurante:", error);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedRestaurant: (restaurant) =>
    set({ selectedRestaurant: restaurant }),
}));
