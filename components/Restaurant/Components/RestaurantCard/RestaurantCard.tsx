import { COLORS } from "@/src/constants/colors";
import { IRestaurantResponse } from "@/src/interfaces/apiResponses";
import { formatPrice } from "@/src/utils/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useAuthStore } from "@/src/store/authStore";

type RestaurantCardProps = {
  restaurant: IRestaurantResponse;
  isFavorited?: boolean;
  onToggleFavorite?: (id: number) => void;
};

const RestaurantCard = ({ 
  restaurant, 
  isFavorited = false, 
  onToggleFavorite 
}: RestaurantCardProps) => {
  const { isCompany } = useAuthStore();
  const {
    id,
    name,
    profileImage: image,
    averageRating,
    dishCount,
    minPrice,
  } = restaurant;

  function handlePress() {
    router.push({
      pathname: "/restaurant-details",
      params: { id },
    });
  }

  function handleToggleFavorite() {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  }

  return (
    <Pressable onPress={handlePress} className="py-4 border-b border-gray-50">
      <View className="flex flex-row items-center">
        {/* Imagem do Restaurante - Estilo Moderno */}
        <Image
          className="h-20 w-20 rounded-2xl bg-gray-100"
          source={{ uri: image }}
          alt={name}
        />

        <View className="flex-1 ml-4 justify-center">
          {/* Nome do Restaurante */}
          <Text className="font-bold text-gray-900 text-base mb-1" numberOfLines={1}>
            {name}
          </Text>

          {/* Linha de Info 1: Nota e Categorias */}
          <View className="flex-row items-center mb-1">
            <AntDesign name="star" size={12} color="#F5A623" />
            <Text className="text-orange-500 font-bold text-xs ml-1">
              {averageRating || "4.5"}
            </Text>
            <Text className="text-gray-400 text-xs ml-1">
              • Restaurante • {dishCount || "0"} pratos
            </Text>
          </View>

          {/* Linha de Info 2: Preço */}
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-xs">
              Pratos a partir de{" "}
              <Text className="font-bold text-gray-700">
                {formatPrice(minPrice)}
              </Text>
            </Text>
          </View>
        </View>

        {/* Ícone de Favorito Interativo - Apenas para Empresas */}
        {isCompany && (
          <Pressable 
            onPress={handleToggleFavorite} 
            className="p-2 hit-slop-10"
            hitSlop={10}
          >
            <Ionicons 
              name={isFavorited ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorited ? COLORS.primary : "#9CA3AF"} 
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default RestaurantCard;
