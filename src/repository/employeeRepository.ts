import axios from "axios";
import { IEmployeeResponse } from "../interfaces/apiResponses";
import { IEmployeeDTO } from "../interfaces/dtos";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL: baseUrl });

const EmployeeRepository = {
  async getEmployees(companyId: number) {
    return await api.get<IEmployeeResponse[]>(
      `/company/${companyId}/employees`
    );
  },

  async createEmployee(employeeData: IEmployeeDTO) {
    console.log("criando funcionario");
    return await api.post<IEmployeeDTO>("/user", employeeData);
  },
};

export default EmployeeRepository;
