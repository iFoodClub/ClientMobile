import {
  IEmployeeSimple,
  IEmployeeWeeklyOrdersResponse,
} from "../interfaces/apiResponses";
import { ICompany } from "../interfaces/interfaces";
import { RepositoryBase } from "./baseRepository";

class CompanyRepository extends RepositoryBase {
  async updateCompanySelectedRestaurant(
    id: number,
    companyData: Partial<ICompany>
  ) {
    return await this.api.put(`/company/${id}`, companyData);
  }

  async updateCompany(
    id: number,
    companyData: Partial<ICompany> & { profileImage?: string }
  ) {
    return await this.api.put(`/company/${id}`, companyData);
  }

  async getEmployeeByCompanyId(companyId: number) {
    return await this.api.get<IEmployeeSimple[]>(
      `/company/${companyId}/employees`
    );
  }

  async getEmployeesWeeklyOrdersCurrentDay(companyId: number) {
    return await this.api.get<IEmployeeWeeklyOrdersResponse>(
      `/company/${companyId}/weekly-orders`
    );
  }
}

export default new CompanyRepository();
