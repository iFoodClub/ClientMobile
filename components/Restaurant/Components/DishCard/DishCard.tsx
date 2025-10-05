import { IDish } from "@/src/interfaces/apiResponses";
import { formatPrice } from "@/src/utils/utils";
import React from "react";
import { Image, Text, View } from "react-native";

type DishCardProps = {
  dish: IDish;
};

const DishCard = ({ dish }: DishCardProps) => {
  return (
    <View className="flex flex-col  w-28  h-52">
      <Image
        className="w-full h-28 object-cover rounded-xl mb-4"
        source={{ uri: dish?.image }}
      />
      <Text className="font-medium text-textBody text-xl mb-2">
        {dish && formatPrice(dish.price)}
      </Text>
      <Text className="text-textBody text-lg font-medium"> {dish?.name}</Text>
    </View>
  );
};

export default DishCard;
