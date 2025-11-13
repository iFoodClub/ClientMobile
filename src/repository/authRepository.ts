import axios from "axios";
import { IEmployeeDTO } from "../interfaces/dtos";
import {
  IBusiness,
  ICepResponse,
  ILoginResponse,
} from "../interfaces/interfaces";
import { RepositoryBase } from "./baseRepository";

class AuthRepository extends RepositoryBase {
  async isAvaliableEmail(email: string) {
    try {
      const response = await this.api.get<{ exists: boolean }>(
        `/user/check-email/${email}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("API de verificação de email falhou:", error);
      throw new Error("Não foi possível verificar o email. Tente novamente.");
    }
  }

  async getAddress(cep: string) {
    try {
      // essa rota é externa, então usa axios direto
      const response = await axios.get<ICepResponse>(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      return response.data;
    } catch (error) {
      console.error("Não foi possível buscar o endereço:", error);
      throw new Error("Não foi possível buscar o endereço. Tente novamente.");
    }
  }

  async login(email: string, password: string) {
    return await this.api.post<ILoginResponse>("/user/login", {
      email,
      password,
    });
  }

  async createBusiness(data: IBusiness) {
    return await this.api.post("/user", data);
  }

  async createEmployee(data: IEmployeeDTO) {
    return await this.api.post("/user", data);
  }

  async logout() {
    return await this.api.post("/user/logout");
  }
}

export default new AuthRepository();
