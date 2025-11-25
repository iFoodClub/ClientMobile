import { IDishesResponse } from "../interfaces/apiResponses";
import { ICreateDishDTO } from "../interfaces/interfaces";
import { RepositoryBase } from "./baseRepository";

class DishRepository extends RepositoryBase {
  async fetchDishesByRestaurantId(restaurantId: number) {
    return await this.api.get<IDishesResponse[]>(
      `/dish/by-restaurant/${restaurantId}`
    );
  }

  async createDish(dishData: ICreateDishDTO) {
    return await this.api.post<IDishesResponse>("/dish", dishData);
  }

  async deleteDish(dishId: number) {
    return await this.api.delete(`/dish/${dishId}`);
  }

  async updateDish(dishData: Partial<IDishesResponse>, dishId: number) {
    return await this.api.put<IDishesResponse>(`/dish/${dishId}`, dishData);
  }
}

export default new DishRepository();
