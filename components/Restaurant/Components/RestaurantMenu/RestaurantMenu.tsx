import { useSelectedRestaurant } from "@/src/hooks/useSelectedRestaurant";
import React from "react";
import { Text, View } from "react-native";

type RestaurantMenuProps = {
  restaurantId: number;
};

const RestaurantMenu = ({ restaurantId }: RestaurantMenuProps) => {
  const { selectedRestaurant } = useSelectedRestaurant({ restaurantId });

  return (
    <View>
      <Text>{selectedRestaurant?.name}</Text>
    </View>
  );
};

export default RestaurantMenu;
