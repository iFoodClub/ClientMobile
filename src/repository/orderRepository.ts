import { ICreateCompanyOrderResponse } from "../interfaces/apiResponses";
import { RepositoryBase } from "./baseRepository";

class OrderRepository extends RepositoryBase {
  async getDayOrder(companyId: number) {}

  async createCompanyWeeklyOrder(companyId: number) {
    return await this.api.post<ICreateCompanyOrderResponse>(
      `/company/${companyId}/create-orders-from-weekly`
    );
  }

  async updateCompanyOrder(
    restaurantId: number,
    orderId: number,
    status: string
  ) {
    return await this.api.put(
      `/restaurant/${restaurantId}/orders/${orderId}/status`,
      { status }
    );
  }

  async getRestaurantOrders(restaurantId: number) {}
}

export default new OrderRepository();
