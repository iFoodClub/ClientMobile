import RestaurantForm from "@/components/Forms/RestaurantForm/RestaurantForm";
import CompanyForm from "@/components/Forms/CompanyForm/CompanyForm";
import MyProfileEmployeeForm from "@/components/Forms/EmployeeForm/MyProfileEmployeeForm";
import { runMigrations } from "@/src/db";
import { useAuthStore } from "@/src/store/authStore";
import { UserType } from "@/src/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";

const PerfilForm = () => {
  const { user, isRestaurant, isCompany, isEmployee } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    runMigrations();
  }, []);

  function handleBackButton() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/settings");
    }
  }

  // Define o subtítulo com base no tipo de usuário logado
  const getSubtitle = () => {
    if (isRestaurant) return "Atualize as informações do seu restaurante";
    if (isCompany) return "Atualize as informações da sua empresa";
    if (isEmployee) return "Atualize as suas informações pessoais";
    return "Atualize o seu perfil";
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header no estilo iFood */}
        <View className="bg-primary/10 pt-16 pb-8 px-6 rounded-b-[40px] mb-8">
          <TouchableOpacity onPress={handleBackButton} className="mb-4 -ml-2">
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900">Editar Perfil</Text>
          <Text className="text-gray-500 mt-1">{getSubtitle()}</Text>
        </View>

        <View className="px-6 pb-20">
          {isRestaurant && <RestaurantForm />}
          {isCompany && <CompanyForm />}
          {isEmployee && <MyProfileEmployeeForm />}
        </View>
      </ScrollView>
    </View>
  );
};

export default PerfilForm;
