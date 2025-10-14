import axios from "axios";
import { IEmployeeResponse } from "../interfaces/apiResponses";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL: baseUrl });

const EmployeeRepository = {
  async getEmployees(companyId: number) {
    return await api.get<IEmployeeResponse[]>(
      `/company/${companyId}/employees`
    );
  },
};

export default EmployeeRepository;
