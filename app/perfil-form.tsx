import RestaurantForm from "@/components/Forms/RestaurantForm/RestaurantForm";
import { runMigrations } from "@/src/db";
import { useAuthStore } from "@/src/store/authStore";
import { UserType } from "@/src/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";

const PerfilForm = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const isRestaurant = user?.userType === UserType.restaurant || !!user?.restaurant;

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

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header no estilo iFood */}
        <View className="bg-primary/10 pt-16 pb-8 px-6 rounded-b-[40px] mb-8">
          <TouchableOpacity onPress={handleBackButton} className="mb-4 -ml-2">
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900">Editar Perfil</Text>
          <Text className="text-gray-500 mt-1">Atualize as informações do seu restaurante</Text>
        </View>

        <View className="px-6 pb-20">
          {isRestaurant ? (
            <RestaurantForm />
          ) : (
            <View className="items-center mt-20">
              <Text className="text-gray-400">
                Formulário em breve para este tipo de usuário.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PerfilForm;
