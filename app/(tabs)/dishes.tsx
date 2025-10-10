import PageHeader from "@/components/PageHeader/PageHeader";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import { useSelectedRestaurant } from "@/src/hooks/useSelectedRestaurant";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { View } from "react-native";
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
      <View className="flex flex-row flex-wrap gap-8 mx-auto">
        {loading &&
          Array.from({ length: 2 }).map((_, index) => <DishCardSkeleton />)}
        {selectedRestaurant?.dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default dishes;
