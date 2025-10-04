import React from "react";
import { Text, View } from "react-native";

type RestaurantMenuProps = {
  restaurantId: number;
};

const RestaurantMenu = ({ restaurantId }: RestaurantMenuProps) => {
  async function fetchRestaurantMenu(restaurantId: number) {}

  return (
    <View>
      <Text>Restaurant</Text>
    </View>
  );
};

export default RestaurantMenu;
