import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import { IRestaurantResponse } from "@/src/interfaces/apiResponses";
import { useAuthStore } from "@/src/store/authStore";
import { useRestaurantStore } from "@/src/store/restaurantStore";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { fetchRestaurants, restaurants, loading } = useRestaurantStore();

  const [restaurantsList, setRestaurantsList] = React.useState<
    IRestaurantResponse[]
  >([]);

  useEffect(() => {
    fetchRestaurants();
    if (restaurants.length > 0) {
      setRestaurantsList(restaurants);
    }
  }, [restaurants]);

  const { user } = useAuthStore();

  return (
    <SafeAreaView>
      <PageHeader
        title="Restaurantes"
        subtitle="Navegue entre nossos restaurantes parceiros"
      />

      {/* {user && (
        <View className="flex flex-row gap-x-8 flex-wrap px-2 gap-y-8 ">
          <RestaurantCard
            id={user.id}
            image={user.profileImage}
            name={user.name}
          />
        </View>
      )} */}

      <View className="flex flex-row gap-x-8 flex-wrap px-2 gap-y-8">
        {restaurantsList.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
