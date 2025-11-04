// src/repositories/EmployeeRepository.ts

import { IEmployeeSimple } from "../interfaces/apiResponses";
import { IEmployeeDTO, IWeeklyOrderDTO } from "../interfaces/dtos";
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

  async selectWeeklyOrderDay(data: IWeeklyOrderDTO) {
    return await this.api.post(
      `/employee-weekly-orders/employee/{employeeId}`,
      data
    );
  }

  async getWeeklyOrdersCurrentDay(companyId: number) {
    return await this.api.get(`/company/${companyId}/weekly-orders`);
  }
}

export default new EmployeeRepository();
