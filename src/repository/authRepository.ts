import axios from "axios";
import {
  IBusiness,
  ICepResponse,
  ILoginResponse,
} from "../interfaces/interfaces";
import { useAuthStore } from "../store/authStore";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
const api = axios.create({ baseURL });

const AuthRepository = {
  async isAvaliableEmail(email: string) {
    try {
      const response = await api.get<{ exists: boolean }>(
        `/user/check-email/${email}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("API de verificação de email falhou:", error);
      throw new Error("Não foi possível verificar o email. Tente novamente.");
    }
  },

  async getAddress(cep: string) {
    try {
      const response = await axios.get<ICepResponse>(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      return response.data;
    } catch (error) {
      console.error("Não foi possível buscar o endereço.", error);
      throw new Error("Não foi possível buscar o endereço. Tente novamente.");
    }
  },

  login(email: string, password: string) {
    return api.post<ILoginResponse>("/user/login", { email, password });
  },

  createBusiness(data: IBusiness) {
    return api.post("/user", data);
  },

  logout() {
    const { user } = useAuthStore();

    return api.post("/user/logout");
  },
};

export default AuthRepository;
