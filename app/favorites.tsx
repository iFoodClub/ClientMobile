import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import RestaurantCardSkeleton from "@/components/Restaurant/Components/RestaurantCard/RestaurantCardSkeleton";
import { useFavorites } from "@/src/hooks/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoritesScreen = () => {
  const { favorites, loading } = useFavorites();

  const handleBack = () => {
    router.back();
  };

  if (loading && favorites.length === 0) {
    return (
      <SafeAreaView className="bg-white flex-1 p-4">
        <PageHeader title="Meus Favoritos" subtitle="Carregando..." />
        <View className="mt-4 space-y-4 gap-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1" edges={['top']}>
      <View className="flex-row items-center px-4 pt-4">
        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="ml-2">
           <Text className="text-2xl font-bold text-gray-900">Meus Favoritos</Text>
           <Text className="text-gray-500 text-sm">Seus restaurantes prediletos</Text>
        </View>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View className="px-4">
            <RestaurantCard restaurant={item} />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-6" />}
        ListEmptyComponent={() => (
          <View className="items-center mt-20 px-10">
            <View className="bg-gray-50 p-6 rounded-full mb-4">
               <Ionicons name="heart-dislike-outline" size={48} color="#D1D5DB" />
            </View>
            <Text className="text-gray-500 font-bold text-lg mb-2">Nada por aqui ainda</Text>
            <Text className="text-gray-400 text-center">
              Você ainda não favoritou nenhum restaurante parceiro.
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/")}
              className="mt-6 bg-primary px-8 py-3 rounded-full"
            >
              <Text className="text-white font-bold">Descobrir Restaurantes</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;
