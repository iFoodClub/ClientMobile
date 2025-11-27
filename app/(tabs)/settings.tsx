import PageHeader from "@/components/PageHeader/PageHeader";
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
      icon: (
        <Entypo name="text-document" size={24} color={COLORS.textDescription} />
      ),
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
      icon: (
        <MaterialIcons name="logout" size={24} color={COLORS.textDescription} />
      ),
      label: "Sair",
      onPress: logout,
    },
  ];

  return (
    <SafeAreaView className="flex-1 ">
      <PageHeader title="Configurações" subtitle="Configure a sua conta" />

      <View className="border border-gray-200 w-11/12 mx-auto p-4  rounded-2xl flex flex-row justify-between  ">
        <View className="flex flex-col justify-center items-center  w-3/5  ">
          <Image
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            source={{ uri: user?.profileImage }}
          />
          <View className="flex flex-col items-center w-full    ">
            <Text className=" font-bold text-xl w-full text-center ">
              {user?.name}
            </Text>
            <Text className="text-gray-400 font-medium">
              {user?.restaurant?.cidade}, {user?.restaurant?.estado}
            </Text>
          </View>
        </View>
        <View className="flex flex-col justify-around">
          <Text className="font-semibold">Email</Text>
          <Text>{user?.email}</Text>
          <Text className="font-semibold">CEP</Text>
          <Text>{user?.restaurant?.cep || user?.company?.cep}</Text>
          <Text className="font-semibold">CNPJ</Text>
          <Text>{user?.restaurant?.cnpj || user?.company?.cnpj}</Text>
        </View>
      </View>

      <View className="mt-8 px-6">
        {configItens.map((item, index) => {
          if (item.label.includes("funcionário")) return null;
          if (item.label.includes("empresa")) return null;

          return <ConfigItem key={index} {...item} />;
        })}
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
