import axios from "axios";
import { ICompany } from "../interfaces/interfaces";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL });

const CompanyRepository = {
  async updateCompanySelectedRestaurant(
    id: number,
    companyData: Partial<ICompany>
  ) {
    return await api.put(`/Company/${id}`, companyData);
  },
};

export default CompanyRepository;
