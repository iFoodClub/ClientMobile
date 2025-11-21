import { IEmployeeSimple } from "../interfaces/apiResponses";
import { ICompany } from "../interfaces/interfaces";
import { RepositoryBase } from "./baseRepository";

class CompanyRepository extends RepositoryBase {
  async updateCompanySelectedRestaurant(
    id: number,
    companyData: Partial<ICompany>
  ) {
    return await this.api.put(`/company/${id}`, companyData);
  }

  async getEmployeeByCompanyId(companyId: number) {
    return await this.api.get<IEmployeeSimple[]>(
      `/company/${companyId}/employees`
    );
  }
}

export default new CompanyRepository();
