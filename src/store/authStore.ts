import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Alert } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IUserDetailsResponse, UserType } from "../interfaces/interfaces";
import AuthRepository from "../repository/authRepository";

type IAuthStore = {
  isLoggedIn: boolean;
  shouldCreateAccount: boolean;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createAccount: () => void;
  reset: () => void;
  updateSelectedRestaurant: (id: number) => void;

  user: IUserDetailsResponse | null;
  isRestaurant: boolean;
  isCompany: boolean;
  isEmployee: boolean;
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      token: "",
      isRestaurant: false,
      isCompany: false,
      isEmployee: false,
      isLoggedIn: false,
      shouldCreateAccount: false,
      user: null,
      login: async (email, password) => {
        try {
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
          console.error("Erro no login:", error);
          Alert.alert("Erro", "Não foi possível fazer o login.");
          throw error;
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
