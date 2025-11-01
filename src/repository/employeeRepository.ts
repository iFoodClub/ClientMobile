// src/repositories/EmployeeRepository.ts

import { IEmployeeSimple } from "../interfaces/apiResponses";
import { IEmployeeDTO } from "../interfaces/dtos";
import { RepositoryBase } from "./baseRepository";

class EmployeeRepository extends RepositoryBase {
  async getEmployees(companyId: number) {
    return await this.api.get<IEmployeeSimple[]>(
      `/company/${companyId}/employees`
    );
  }

  async createEmployee(employeeData: IEmployeeDTO) {
    return await this.api.post<IEmployeeDTO>("/user", employeeData);
  }

  async deleteEmployee(employeeId: number) {
    return await this.api.delete(`/employee/${employeeId}`);
  }

  async updateEmployee(
    employeeId: number,
    employeeData: Partial<IEmployeeSimple>
  ) {
    return await this.api.put(`/employee/${employeeId}`, employeeData);
  }
}

export default new EmployeeRepository();
