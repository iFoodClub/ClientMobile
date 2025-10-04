import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Alert } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IUserDetailsResponse, UserType } from "../interfaces/interfaces";
import AuthRepository from "../repository/authRepository";

type IAuthStore = {
  isLoggedIn: boolean;
  shouldCreateAccount: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  createAccount: () => void;
  reset: () => void;
  user: IUserDetailsResponse | null;

  isRestaurant: boolean;
  isCompany: boolean;
  isEmployee: boolean;
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
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
        }
      },
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          isCompany: false,
          isEmployee: false,
          isRestaurant: false,
        }),
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
