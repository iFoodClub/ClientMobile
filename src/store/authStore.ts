import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Alert } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IUpdateRestaurantDTO } from "../interfaces/dtos";
import { IUserDetailsResponse, UserType } from "../interfaces/interfaces";
import AuthRepository from "../repository/authRepository";

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
  updateUserRestaurant: (id: number, data: IUpdateRestaurantDTO) => void;

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
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        try {
          await AuthRepository.logout();
          set({
            isLoggedIn: false,
            user: null,
            isCompany: false,
            isEmployee: false,
            isRestaurant: false,
            loading: false,
          });
        } catch (error) {
          console.log("Erro no logout:", error);
          set({
            isLoggedIn: false,
            user: null,
            isCompany: false,
            isEmployee: false,
            isRestaurant: false,
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
      updateUserRestaurant: (id: number, data: IUpdateRestaurantDTO) => {
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
      reset: () => set({ isLoggedIn: false, shouldCreateAccount: false }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        getItem: getItemAsync,
        setItem: setItemAsync,
        removeItem: deleteItemAsync,
      })),
    }
  )
);
