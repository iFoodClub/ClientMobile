import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// Correção nos nomes das importações
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Alert } from "react-native";

import { IUserDetailsResponse } from "../interfaces/interfaces";
import { login } from "../repository/authRepository";

type IAuthStore = {
  isLoggedIn: boolean;
  shouldCreateAccount: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  createAccount: () => void;
  reset: () => void;
  user: IUserDetailsResponse | null;
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      shouldCreateAccount: false,
      user: null,
      login: async (email, password) => {
        try {
          const response = await login(email, password);

          set({
            isLoggedIn: true,
            shouldCreateAccount: false,
            user: response.data.userDetails,
          });
        } catch (error) {
          console.error("Erro no login:", error);
          Alert.alert("Erro", "Não foi possível fazer o login.");
        }
      },
      logout: () => set({ isLoggedIn: false, shouldCreateAccount: false }),
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
