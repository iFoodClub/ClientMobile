import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import RestaurantCardSkeleton from "@/components/Restaurant/Components/RestaurantCard/RestaurantCardSkeleton";
import { useFetchRestaurants } from "@/src/hooks/useRestaurants";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { restaurants, loading, error } = useFetchRestaurants();

  return (
    <SafeAreaView className="bg-white w-full h-full">
      <PageHeader
        title="Restaurantes"
        subtitle="Navegue entre nossos restaurantes parceiros"
      />

      <View className="flex flex-row gap-x-8 flex-wrap gap-y-8 px-2">
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        {restaurants.map((restaurant) => (
          <>
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          </>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
