import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// Correção nos nomes das importações
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

type IAuthStore = {
  isLoggedIn: boolean;
  shouldCreateAccount: boolean;
  login: () => void;
  logout: () => void;
  createAccount: () => void;
  reset: () => void;
};

// Correção na sintaxe do `create` e `persist`
export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      shouldCreateAccount: true,
      login: () => set({ isLoggedIn: true, shouldCreateAccount: false }),
      logout: () => set({ isLoggedIn: false, shouldCreateAccount: true }),
      createAccount: () =>
        set({ isLoggedIn: false, shouldCreateAccount: true }),
      reset: () => set({ isLoggedIn: false, shouldCreateAccount: true }),
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
