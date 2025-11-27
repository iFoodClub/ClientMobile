import { IDish } from "@/src/interfaces/apiResponses";
import { formatPrice } from "@/src/utils/utils";
import React from "react";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

type DishCardProps = {
  dish: IDish;
  onLongPress: (event: GestureResponderEvent) => void;
};

const DishCard = ({ dish, onLongPress }: DishCardProps) => {
  return (
    <Pressable onLongPress={onLongPress}>
      <View className="flex flex-col  w-24  h-60 ">
        <Image
          className="w-full h-24 object-cover rounded-xl mb-4"
          source={{ uri: dish.image }}
        />
        <Text className="font-semibold text-textBody text-base mb-2">
          {dish && formatPrice(dish?.price)}
        </Text>
        <Text className="text-textDescription text-base font-medium">
          {dish?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default DishCard;
