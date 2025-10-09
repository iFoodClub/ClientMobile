import PageHeader from "@/components/PageHeader/PageHeader";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import { useSelectedRestaurant } from "@/src/hooks/useSelectedRestaurant";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dishes = () => {
  const { user } = useAuthStore();
  const { selectedRestaurant, loading } = useSelectedRestaurant({
    restaurantId: user?.restaurant?.id,
  });

  return (
    <SafeAreaView>
      <PageHeader
        title="Pratos"
        subtitle="Gerencie os pratos do seu restaurante"
      />
      <View className="flex flex-row items-center gap-x-6 mx-auto">
        {loading && <Text>Carregando...</Text>}
        {selectedRestaurant?.dishes.map((dish) => (
          <DishCard dish={dish} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default dishes;
