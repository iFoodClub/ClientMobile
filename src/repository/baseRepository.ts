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

    // Interceptor para incluir o token na requisição
    this.api.interceptors.request.use(
      async (config) => {
        const isLoginRoute = config.url?.includes("/user/login");

        if (!isLoginRoute) {
          const { token } = useAuthStore.getState();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const { logout } = useAuthStore.getState();
        const requestUrl = error.config?.url || "";

        if (
          error.response?.status === 401 &&
          !requestUrl.includes("/user/logout")
        ) {
          if (__DEV__)
            console.warn("⚠️ Token expirado ou inválido. Efetuando logout...");
          logout();
        }

        if (__DEV__) {
          console.log(
            JSON.stringify(
              {
                title: "❌ Erro na requisição Axios:",
                url: error.config?.url,
                method: error.config?.method,
                message:
                  error?.response?.data?.message ||
                  error?.message ||
                  "Erro desconhecido",
                status: error.response?.status,
                token: error.config?.headers?.Authorization,
              },
              null,
              2
            )
          );
        }

        return Promise.reject(error);
      }
    );
  }
}
