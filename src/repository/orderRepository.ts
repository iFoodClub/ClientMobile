import { ICreateCompanyOrderResponse } from "../interfaces/apiResponses";
import { RepositoryBase } from "./baseRepository";

class OrderRepository extends RepositoryBase {
  async getDayOrder(companyId: number) {}

  async createCompanyWeeklyOrder(companyId: number) {
    return await this.api.post<ICreateCompanyOrderResponse>(
      `/company/${companyId}/create-orders-from-weekly`
    );
  }
}

export default new OrderRepository();
