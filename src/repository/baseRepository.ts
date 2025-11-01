import axios, { AxiosError, AxiosInstance } from "axios";
import { useAuthStore } from "../store/authStore";

export class RepositoryBase {
  protected api: AxiosInstance;

  constructor() {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    this.api = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
    });

    //Coloca o token na requisição
    this.api.interceptors.request.use(
      async (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        if (__DEV__) console.error("❌ Erro no interceptor de request:", error);
        return Promise.reject(error);
      }
    );

    //Verifica se o token expirou e faz o logout
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const { logout } = useAuthStore.getState();

        if (error.response?.status === 401) {
          if (__DEV__)
            console.warn("⚠️ Token expirado ou inválido. Efetuando logout...");
          logout();
        }

        if (__DEV__) {
          console.error("❌ Erro na requisição Axios:", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
          });
        }

        return Promise.reject(error);
      }
    );
  }
}
