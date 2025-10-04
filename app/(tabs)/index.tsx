import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import { useFetchRestaurants } from "@/src/hooks/useRestaurants";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { restaurants, loading, error } = useFetchRestaurants();

  const { user } = useAuthStore();

  return (
    <SafeAreaView>
      <PageHeader
        title="Restaurantes"
        subtitle="Navegue entre nossos restaurantes parceiros"
      />

      <View className="flex flex-row gap-x-8 flex-wrap px-2 gap-y-8">
        {/* {loading && <RestaurantCardSkeleton />} */}

        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
