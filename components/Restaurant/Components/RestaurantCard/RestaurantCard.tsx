import { COLORS } from "@/src/constants/colors";
import { IRestaurantResponse } from "@/src/interfaces/apiResponses";
import { formatPrice } from "@/src/utils/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useAuthStore } from "@/src/store/authStore";

import { isRestaurantOpen } from "@/src/utils/restaurantStatus";

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
    openingTime,
    closingTime,
  } = restaurant;

  const isOpen = isRestaurantOpen(openingTime, closingTime);

  function handlePress() {
    if (!isOpen) return;
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
    <Pressable 
      onPress={handlePress} 
      className={`py-4 border-b border-gray-50 ${!isOpen ? "opacity-60" : ""}`}
    >
      <View className="flex flex-row items-center">
        {/* Imagem do Restaurante - Estilo Moderno */}
        <View className="relative">
          <Image
            className={`h-20 w-20 rounded-2xl bg-gray-100 ${!isOpen ? "grayscale" : ""}`}
            source={{ uri: image }}
            alt={name}
          />
          {!isOpen && (
            <View className="absolute inset-0 bg-black/20 rounded-2xl items-center justify-center">
              <Text className="text-white font-bold text-[10px] uppercase">Fechado</Text>
            </View>
          )}
        </View>

        <View className="flex-1 ml-4 justify-center">
          {/* Nome do Restaurante */}
          <Text className={`font-bold text-gray-900 text-base mb-1 ${!isOpen ? "text-gray-500" : ""}`} numberOfLines={1}>
            {name}
          </Text>

          {/* Linha de Info 1: Nota e Categorias */}
          <View className="flex-row items-center mb-1">
            <AntDesign name="star" size={12} color={isOpen ? "#F5A623" : "#D1D5DB"} />
            <Text className={`${isOpen ? "text-orange-500" : "text-gray-400"} font-bold text-xs ml-1`}>
              {averageRating || "4.5"}
            </Text>
            <Text className="text-gray-400 text-xs ml-1">
              • Restaurante • {dishCount || "0"} pratos
            </Text>
          </View>

          {/* Linha de Info 2: Preço ou Status */}
          <View className="flex-row items-center">
            {isOpen ? (
              <Text className="text-gray-500 text-xs">
                Pratos a partir de{" "}
                <Text className="font-bold text-gray-700">
                  {formatPrice(minPrice)}
                </Text>
              </Text>
            ) : (
              <Text className="text-red-400 text-[10px] font-bold uppercase">
                Abre às {openingTime}
              </Text>
            )}
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
