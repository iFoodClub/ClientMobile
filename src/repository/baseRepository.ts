import axios, { AxiosError, AxiosInstance } from "axios";
import { getApiBaseUrl } from "../config/apiBaseUrl";
import { useAuthStore } from "../store/authStore";

export class RepositoryBase {
  protected api: AxiosInstance;

  constructor() {
    const baseUrl = getApiBaseUrl();

    if (__DEV__) {
      console.log("[API] baseURL:", baseUrl);
    }

    this.api = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
    });

    this.api.interceptors.request.use(
      async (config) => {
        const { token } = useAuthStore.getState();
        const publicRoutes = ["/user/login", "/user/register"];

        if (token && !publicRoutes.some((r) => config.url?.includes(r))) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          delete config.headers.Authorization;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        const { logout } = useAuthStore.getState();
        const requestUrl = error.config?.url || "";

        if (
          error.response?.status === 401 &&
          !requestUrl.includes("/user/logout") &&
          !requestUrl.includes("/user/login")
        ) {
          if (__DEV__)
            console.warn("⚠️ Sessão expirada ou não autorizada. Efetuando logout automático...");
          
          logout();
          
          // Pequeno delay para garantir que o estado da store seja processado
          // antes de forçar a navegação, evitando concorrência com Toast/Alerts
          setTimeout(async () => {
            try {
              const { router } = await import("expo-router");
              router.replace("/sign-in");
            } catch (navError) {
              console.error("Erro ao redirecionar após logout:", navError);
            }
          }, 100);
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
