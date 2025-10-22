import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Alert } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IUpdateRestaurantDTO } from "../interfaces/dtos"; // Certifique-se que o caminho está correto
import { IUserDetailsResponse, UserType } from "../interfaces/interfaces"; // Certifique-se que o caminho está correto
import AuthRepository from "../repository/authRepository"; // Certifique-se que o caminho está correto

type IAuthStore = {
  isLoggedIn: boolean;
  shouldCreateAccount: boolean;
  token: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createAccount: () => void;
  reset: () => void;
  updateSelectedRestaurant: (id: number) => void;
  updateUserRestaurant: (data: IUpdateRestaurantDTO) => void;

  user: IUserDetailsResponse | null;
  isRestaurant: boolean;
  isCompany: boolean;
  isEmployee: boolean;
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      loading: false,
      token: "",
      isRestaurant: false,
      isCompany: false,
      isEmployee: false,
      isLoggedIn: false,
      shouldCreateAccount: false,
      user: null,

      login: async (email, password) => {
        try {
          set({ loading: true });
          const response = await AuthRepository.login(email, password);
          set({
            token: response.data.token,
            isLoggedIn: true,
            shouldCreateAccount: false,
            user: response.data.userDetails,
            isRestaurant:
              response.data.userDetails.userType === UserType.restaurant,
            isEmployee:
              response.data.userDetails.userType === UserType.employee,
            isCompany: response.data.userDetails.userType === UserType.company,
          });
        } catch (error) {
          Alert.alert("Erro", "Não foi possível fazer o login.");
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await AuthRepository.logout();
        } catch (error) {
          console.log("Erro no logout API:", error);
        } finally {
          set({
            token: "",
            isLoggedIn: false,
            user: null,
            isCompany: false,
            isEmployee: false,
            isRestaurant: false,
            loading: false,
          });
        }
      },

      updateSelectedRestaurant: (id: number) => {
        set((state) => {
          if (!state.user || !state.user.company) {
            return state;
          }
          return {
            user: {
              ...state.user,
              company: {
                ...state.user.company,
                restaurantId: id,
              },
            },
          };
        });
      },

      updateUserRestaurant: (data: IUpdateRestaurantDTO) => {
        set((state) => {
          if (!state.user || !state.user.restaurant) {
            return state;
          }
          return {
            user: {
              ...state.user,
              restaurant: {
                ...state.user.restaurant,
                ...data,
              },
            },
          };
        });
      },

      createAccount: () =>
        set({ isLoggedIn: false, shouldCreateAccount: true }),

      reset: () =>
        set({ isLoggedIn: false, shouldCreateAccount: false, loading: false }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const str = await getItemAsync(name);
          return str;
        },
        setItem: setItemAsync,
        removeItem: deleteItemAsync,
      })),
    }
  )
);
