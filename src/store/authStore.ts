import { Alert } from "react-native";
import { create } from "zustand";

import { IUpdateRestaurantDTO } from "../interfaces/dtos";
import { IUserDetailsResponse, UserType } from "../interfaces/interfaces";
import AuthRepository from "../repository/authRepository";

type IAuthStore = {
  isLoggedIn: boolean;
  shouldCreateAccount: boolean;
  token: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createAccount: () => void;
  reset: () => void;
  updateSelectedRestaurant: (id: number) => void;
  updateUserRestaurant: (data: IUpdateRestaurantDTO) => void;
  loginOffline: (perfilLocal: any) => void;

  user: IUserDetailsResponse | null;
  isRestaurant: boolean;
  isCompany: boolean;
  isEmployee: boolean;
};

export const useAuthStore = create<IAuthStore>((set, _get) => ({
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
      const userDetails = response.data.userDetails;

      console.log(JSON.stringify(response, null, 2));

      set({
        token: response.data.token,
        isLoggedIn: true,
        shouldCreateAccount: false,
        user: userDetails,
        isRestaurant: userDetails.userType === UserType.restaurant,
        isEmployee: userDetails.userType === UserType.employee,
        isCompany: userDetails.userType === UserType.company,
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
      const axios = (await import("axios")).default;
      delete axios.defaults.headers.common["Authorization"];

      set({
        token: "",
        isLoggedIn: false,
        user: null,
        isCompany: false,
        isEmployee: false,
        isRestaurant: false,
        loading: false,
        shouldCreateAccount: false,
      });

      console.log("✅ Logout completo: estado limpo e token removido");
    }
  },

  updateSelectedRestaurant: (id: number) => {
    set((state) => {
      if (!state.user?.company) return state;
      return {
        user: {
          ...state.user,
          company: { ...state.user.company, selectedRestaurantId: id },
        },
      };
    });
  },

  updateUserRestaurant: (data: IUpdateRestaurantDTO) => {
    set((state) => {
      if (!state.user?.restaurant) return state;
      return {
        user: {
          ...state.user,
          restaurant: { ...state.user.restaurant, ...data },
        },
      };
    });
  },

  createAccount: () => set({ isLoggedIn: false, shouldCreateAccount: true }),

  reset: () => set({ isLoggedIn: false, shouldCreateAccount: false }),

  loginOffline: (perfilLocal: any) =>
    set(() => {
      if (!perfilLocal || !perfilLocal.userId) {
        return { isLoggedIn: false, user: null };
      }
      return {
        isLoggedIn: true,
        user: {
          id: perfilLocal.userId,
          email: perfilLocal.email,
          name: perfilLocal.name || "",
          token: "",
          profileImage: perfilLocal.photo || "",
          userType: UserType.restaurant,
          restaurant: {
            id: Number(perfilLocal.userId),
            userId: Number(perfilLocal.userId),
            cnpj: "",
            cep: "",
            rua: "",
            cidade: "",
            estado: "",
            number: "",
            complemento: "",
            ...perfilLocal.data,
            name: perfilLocal.name,
            image: perfilLocal.photo,
          },
        } as IUserDetailsResponse,
        isRestaurant: true,
        isEmployee: false,
        isCompany: false,
      };
    }),
}));
