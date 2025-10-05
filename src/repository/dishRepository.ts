import axios from "axios";
import { IDishesResponse } from "../interfaces/apiResponses";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL });

const DishRepository = {
  async fetchDishesByRestaurantId(restaurantId: number) {
    return await api.get<IDishesResponse>(`/Dish/${restaurantId}`);
  },
};

export default DishRepository;
