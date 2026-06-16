import {
  IRestaurantDetailsResponse,
  IRestaurantOrdersResponse,
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

  async getRestaurantOrders(restaurantId: number) {
    console.log(restaurantId);

    return await this.api.get<IRestaurantOrdersResponse[]>(
      `/restaurant/${restaurantId}/orders`
    );
  }

  async toggleFavorite(userId: number, restaurantId: number, userType: string) {
    return await this.api.post<{ favorited: boolean }>("/Restaurant/favorites/toggle", {
      userId,
      restaurantId,
      userType,
    });
  }

  async fetchFavorites(userId: number) {
    return await this.api.get<IRestaurantResponse[]>(`/Restaurant/favorites/${userId}`);
  }
}

export default new RestaurantRepository();
