import {
  IRestaurantDetailsResponse,
  IRestaurantResponse,
} from "../interfaces/apiResponses";
import { IUpdateRestaurantDTO } from "../interfaces/dtos";
import { RepositoryBase } from "./baseRepository";

class RestaurantRepository extends RepositoryBase {
  async fetchRestaurants() {
    return await this.api.get<IRestaurantResponse[]>("/restaurant");
  }

  async fetchSelectedRestaurant(id: number) {
    return await this.api.get<IRestaurantDetailsResponse>(`/restaurant/${id}`);
  }

  async updateRestaurant(
    id: number,
    restaurantData: Partial<IUpdateRestaurantDTO>
  ) {
    return await this.api.put(`/restaurant/${id}`, restaurantData);
  }
}

export default new RestaurantRepository();
