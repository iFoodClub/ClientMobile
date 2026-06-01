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
    <Pressable onLongPress={onLongPress} className="w-[30%] mb-6">
      <View className="flex flex-col">
        {/* Imagem do Prato - Seguindo o estilo do Skeleton */}
        <Image
          className="w-full h-24 rounded-3xl mb-2"
          source={{ uri: dish.image }}
        />
        
        {/* Preço em destaque */}
        <Text className="font-bold text-gray-800 text-sm">
          {dish && formatPrice(dish?.price)}
        </Text>
        
        {/* Nome do Prato - Mais suave */}
        <Text className="text-gray-400 text-xs font-medium" numberOfLines={2}>
          {dish?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default DishCard;
