import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import { ToastExample } from "@/src/components/Toast/ToastExample";
import { useFetchRestaurants } from "@/src/hooks/useRestaurants";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { restaurants, loading, error } = useFetchRestaurants();

  return (
    <SafeAreaView>
      <PageHeader
        title="Restaurantes"
        subtitle="Navegue entre nossos restaurantes parceiros"
      />

      <View className="flex flex-row gap-x-8 flex-wrap px-2 gap-y-8">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </View>

      <ToastExample />
    </SafeAreaView>
  );
};

export default HomeScreen;
