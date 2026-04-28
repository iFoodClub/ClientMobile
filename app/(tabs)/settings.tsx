import PageHeader from "@/components/PageHeader/PageHeader";
import ConfigItem from "@/components/ui/ConfigItem/ConfigItem";
import { COLORS } from "@/src/constants/colors";
import { UserType } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const { logout, user } = useAuthStore();

  const handleUpdateInfo = () => {
    router.push({
      pathname: "/perfil-form",
    });
  };

  const configItens = [
    {
      icon: (
        <Ionicons name="person-outline" size={22} color="#4B5563" />
      ),
      label: "Dados da conta",
      onPress: handleUpdateInfo,
    },
    {
      icon: (
        <Ionicons name="notifications-outline" size={22} color="#4B5563" />
      ),
      label: "Notificações",
      onPress: () => {},
    },
    {
      icon: (
        <Ionicons name="help-circle-outline" size={22} color="#4B5563" />
      ),
      label: "Ajuda",
      onPress: () => {},
    },
    {
      icon: (
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
      ),
      label: "Sair",
      onPress: logout,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Estilo iFood: Fundo Colorido Suave */}
        <View className="bg-primary/10 pt-16 pb-10 px-6 rounded-b-[40px]">
          <Text className="text-3xl font-bold text-gray-900 mb-8">Perfil</Text>
          
          <TouchableOpacity 
            onPress={handleUpdateInfo}
            className="flex-row items-center"
          >
            <View className="relative">
              <Image
                className="w-16 h-16 rounded-full border-2 border-white"
                source={{ uri: user?.profileImage }}
              />
              <View className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full items-center justify-center shadow-sm">
                <Ionicons name="camera" size={12} color={COLORS.primary} />
              </View>
            </View>
            
            <View className="ml-4 flex-1">
              <Text className="font-bold text-xl text-gray-900">
                {user?.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-primary font-medium mr-1">Editar perfil</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Lista de Itens com Divisores */}
        <View className="mt-4">
          {configItens.map((item, index) => {
            return (
              <View key={index}>
                <View className="px-6">
                  <ConfigItem {...item} />
                </View>
                {index < configItens.length - 1 && (
                  <View className="h-[1px] bg-gray-100 ml-20" />
                )}
              </View>
            );
          })}
        </View>

        {/* Versão do App (detalhe charmoso) */}
        <View className="items-center mt-10 mb-20">
          <Text className="text-gray-300 text-xs">FoodClub v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
