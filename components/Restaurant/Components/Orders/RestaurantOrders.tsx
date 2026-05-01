import { useOrders } from "@/src/hooks/useOrders";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { FlatList } from "react-native";
import RestaurantOrderCard from "./RestaurantOrderCard";

const RestaurantOrders = () => {
  const { user } = useAuthStore();
  const {
    getRestaurantOrders,
    restaurantOrders,
    isLoading,
    updateCompanyOrder,
  } = useOrders();

  React.useEffect(() => {
    if (user?.restaurant?.id) {
      getRestaurantOrders(user.restaurant.id);
    }
  }, [getRestaurantOrders, user?.restaurant?.id]);

  return (
    <FlatList
      className="px-4"
      data={restaurantOrders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <RestaurantOrderCard
          restaurantOrder={item}
          updateCompanyOrder={updateCompanyOrder}
        />
      )}
      contentContainerStyle={{ paddingVertical: 16, gap: 16 }}
      refreshing={isLoading}
    />
  );
};

export default RestaurantOrders;
