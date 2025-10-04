import axios from "axios";
import { IRestaurantResponse } from "../interfaces/apiResponses";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL });

const RestaurantRepository = {
  async fetchRestaurants() {
    const response = await api.get<IRestaurantResponse[]>("/Restaurant");
    return response;
  },
};

export default RestaurantRepository;
