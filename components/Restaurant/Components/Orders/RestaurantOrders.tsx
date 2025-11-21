import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { Text, View } from "react-native";

const RestaurantOrders = () => {
  const { user } = useAuthStore();

  console.log(console.log(JSON.stringify(user?.restaurant, null, 2)));

  return (
    <View>
      <Text>RestaurantOrders</Text>
    </View>
  );
};

export default RestaurantOrders;
