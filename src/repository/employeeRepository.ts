import axios from "axios";
import { IEmployeeSimple } from "../interfaces/apiResponses";
import { IEmployeeDTO } from "../interfaces/dtos";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL: baseUrl });

const EmployeeRepository = {
  async getEmployees(companyId: number) {
    return await api.get<IEmployeeSimple[]>(`/company/${companyId}/employees`);
  },

  async createEmployee(employeeData: IEmployeeDTO) {
    return await api.post<IEmployeeDTO>("/user", employeeData);
  },

  async deleteEmployee(employeeId: number) {
    return await api.delete(`/employee/${employeeId}`);
  },

  async updateEmployee(
    employeeId: number,
    employeeData: Partial<IEmployeeSimple>
  ) {
    return await api.put(`/employee/${employeeId}`, employeeData);
  },
};

export default EmployeeRepository;
