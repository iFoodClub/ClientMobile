import ConfigItem from "@/components/ui/ConfigItem/ConfigItem";
import { COLORS } from "@/src/constants/colors";
import { UserType } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
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
      icon: <Entypo name="text-document" size={20} color={COLORS.textBody} />,
      label: `Informações ${
        user?.userType === UserType.company
          ? "da empresa"
          : user?.userType === UserType.restaurant
          ? "do restaurante"
          : "do funcionário"
      }`,
      onPress: handleUpdateInfo,
    },
    {
      icon: <MaterialIcons name="logout" size={20} color={COLORS.textBody} />,
      label: "Sair",
      onPress: logout,
    },
  ];

  return (
    <SafeAreaView className="flex-1 ">
      <View className="flex flex-row items-center gap-x-4 mb-4">
        <Image
          className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          source={{ uri: user?.profileImage }}
        />
        <View>
          <Text className="text-2xl font-semibold">{user?.name}</Text>
          <Text>
            {user?.userType === UserType.restaurant
              ? "Restaurante"
              : user?.userType === UserType.company
              ? "Empresa"
              : "Funcionário"}
          </Text>
        </View>
      </View>

      <View className="pt-8">
        {configItens.map((item, index) => (
          <ConfigItem key={index} {...item} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
