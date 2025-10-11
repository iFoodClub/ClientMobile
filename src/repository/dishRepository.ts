import axios from "axios";
import { IDishesResponse } from "../interfaces/apiResponses";
import { ICreateDishDTO } from "../interfaces/interfaces";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL });

const DishRepository = {
  async fetchDishesByRestaurantId(restaurantId: number) {
    return await api.get<IDishesResponse>(`/Dish/${restaurantId}`);
  },

  async createDish(dishData: ICreateDishDTO) {
    return await api.post<IDishesResponse>("/Dish", dishData);
  },
};

export default DishRepository;
