import PressableButton from "@/components/Button/PressableButton";
import RestaurantForm from "@/components/Forms/RestaurantForm/RestaurantForm";

import PageHeader from "@/components/PageHeader/PageHeader";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PerfilForm = () => {
  const { user, isRestaurant, isCompany, isEmployee } = useAuthStore();

  function handleBackButton() {
    router.push({
      pathname: "/settings",
    });
  }

  return (
    <SafeAreaView>
      <PressableButton
        className="absolute top-6 left-4"
        onPress={handleBackButton}
        icon={<AntDesign name="arrow-left" size={16} color="black" />}
      />
      <PageHeader title="Editar Perfil" subtitle="Atualize suas informações" />
      <ScrollView>{isRestaurant && <RestaurantForm />}</ScrollView>
    </SafeAreaView>
  );
};

export default PerfilForm;
