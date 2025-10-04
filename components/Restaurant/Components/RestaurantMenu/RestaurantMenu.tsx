import DishRepository from "@/src/repository/dishRepository";
import React from "react";
import { Text, View } from "react-native";

type RestaurantMenuProps = {
  restaurantId: number;
};

const RestaurantMenu = ({ restaurantId }: RestaurantMenuProps) => {
  async function fetchRestaurantMenu(restaurantId: number) {
    const response = await DishRepository.fetchDishesByRestaurantId(
      restaurantId
    );
  }

  return (
    <View>
      <Text>Restaurant</Text>
    </View>
  );
};

export default RestaurantMenu;
