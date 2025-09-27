import axios from "axios";
import { ICepResponse, ILoginResponse } from "../interfaces/interfaces";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

const api = axios.create({ baseURL });

export async function isAvaliableEmail(email: string) {
  try {
    const response = await api.get<{ exists: boolean }>(
      `/user/check-email/${email}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("API de verificação de email falhou:", error);
    throw new Error("Não foi possível verificar o email. Tente novamente.");
  }
}

export async function getAddress(cep: string) {
  try {
    const response = await axios.get<ICepResponse>(
      `https://viacep.com.br/ws/${cep}/json/`
    );
    return response.data;
  } catch (error) {
    console.error("Não foi possível buscar o endereço.", error);
    throw new Error("Não foi possível buscar o endereço. Tente novamente.");
  }
}

export async function login(email: string, password: string) {
  return api.post<ILoginResponse>("/user/login", { email, password });
}
