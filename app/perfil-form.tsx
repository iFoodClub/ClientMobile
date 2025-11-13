import PressableButton from "@/components/Button/PressableButton";
import RestaurantForm from "@/components/Forms/RestaurantForm/RestaurantForm";

import PageHeader from "@/components/PageHeader/PageHeader";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations } from "@/src/db";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PerfilForm = () => {
  const { user, isRestaurant, isCompany, isEmployee } = useAuthStore();
  const { showSuccess, showError } = useToastAll();

  console.log(JSON.stringify(user, null, 2));

  // ao montar, garantir tabelas (sincronização agora é global)
  useEffect(() => {
    runMigrations();
  }, []);

  function handleBackButton() {
    router.push({
      pathname: "/settings",
    });
  }

  return (
    <SafeAreaView>
      <View className="pl-2">
        <PressableButton
          className=""
          onPress={handleBackButton}
          icon={<AntDesign name="arrow-left" size={16} color="black" />}
        />
      </View>
      <PageHeader title="Editar Perfil" subtitle="Atualize suas informações" />
      <ScrollView>{isRestaurant && <RestaurantForm />}</ScrollView>
    </SafeAreaView>
  );
};

export default PerfilForm;
