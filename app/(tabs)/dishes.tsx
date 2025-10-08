import PageHeader from "@/components/PageHeader/PageHeader";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dishes = () => {
  const { user } = useAuthStore();

  return (
    <View>
      <SafeAreaView>
        <PageHeader title="Pratos" subtitle="Seus pratos favoritos" />
      </SafeAreaView>
    </View>
  );
};

export default dishes;
