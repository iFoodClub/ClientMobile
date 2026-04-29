import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import RestaurantCardSkeleton from "@/components/Restaurant/Components/RestaurantCard/RestaurantCardSkeleton";
import { useFetchRestaurants } from "@/src/hooks/useRestaurants";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useAuthStore } from "@/src/store/authStore";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { restaurants, loading: loadingRestaurants } = useFetchRestaurants();
  const { favorites, loading: loadingFavorites } = useFavorites();
  const { user, isEmployee, isCompany } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  // Identifica o restaurante selecionado pela empresa
  const selectedRestaurantId = isEmployee 
    ? user?.employee?.company?.selectedRestaurantId 
    : isCompany 
      ? user?.company?.selectedRestaurantId 
      : null;

  const highlightedRestaurant = useMemo(() => {
    return restaurants.find(r => r.id === selectedRestaurantId);
  }, [restaurants, selectedRestaurantId]);

  const filteredRestaurants = useMemo(() => {
    return activeTab === 'all' ? restaurants : favorites;
  }, [activeTab, restaurants, favorites]);

  const renderHighlightedCard = () => {
    if (!isEmployee && !isCompany) return null;

    return (
      <View className="px-4 mb-6">
        <Text className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-3 ml-1">
          {isEmployee ? "Restaurante da Semana" : "Configuração Atual"}
        </Text>
        
        {highlightedRestaurant ? (
          <View className="border-2 border-primary/20 rounded-3xl overflow-hidden bg-primary/5">
            <RestaurantCard 
              restaurant={highlightedRestaurant} 
              isFavorited={favorites.some(fav => fav.id === highlightedRestaurant.id)}
              onToggleFavorite={toggleFavorite}
            />
            <View className="bg-primary/10 px-4 py-2 flex-row items-center justify-center">
              <Ionicons name="star" size={12} color={COLORS.primary} />
              <Text className="text-primary text-[10px] font-bold ml-1 uppercase">
                Restaurante Selecionado
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            activeOpacity={0.8}
            className="border-2 border-dashed border-gray-200 rounded-3xl p-8 items-center justify-center bg-gray-50"
          >
            <View className="bg-white p-4 rounded-full shadow-sm mb-3">
              <Ionicons name="restaurant-outline" size={32} color="#D1D5DB" />
            </View>
            <Text className="text-gray-500 font-bold text-center px-4">
              {isCompany 
                ? "Selecione um restaurante para disponibilizar para sua equipe" 
                : "Nenhum restaurante disponível no momento"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loadingRestaurants && restaurants.length === 0) {
    return (
      <SafeAreaView className="bg-white flex-1 p-4">
        <PageHeader title="Restaurantes" subtitle="Carregando parceiros..." />
        <View className="mt-4 space-y-4 gap-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1" edges={['top']}>
      <PageHeader
        title="Restaurantes"
        subtitle="Navegue entre nossos parceiros"
      />

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {renderHighlightedCard()}

            {/* Tabs Selector - Apenas para Empresas */}
            {isCompany ? (
              <View className="flex-row px-4 mb-6 gap-x-3">
                <TouchableOpacity 
                  onPress={() => setActiveTab('all')}
                  className={`px-6 py-2.5 rounded-full ${activeTab === 'all' ? 'bg-primary shadow-md shadow-primary/30' : 'bg-gray-100'}`}
                >
                  <Text className={`font-bold text-sm ${activeTab === 'all' ? 'text-white' : 'text-gray-500'}`}>Todos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => setActiveTab('favorites')}
                  className={`px-6 py-2.5 rounded-full flex-row items-center ${activeTab === 'favorites' ? 'bg-primary shadow-md shadow-primary/30' : 'bg-gray-100'}`}
                >
                  <Ionicons 
                    name={activeTab === 'favorites' ? "heart" : "heart-outline"} 
                    size={14} 
                    color={activeTab === 'favorites' ? "white" : "#9CA3AF"} 
                    style={{ marginRight: 6 }}
                  />
                  <Text className={`font-bold text-sm ${activeTab === 'favorites' ? 'text-white' : 'text-gray-500'}`}>Favoritos</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="px-4 mb-2">
                 <Text className="text-gray-400 text-[10px] uppercase tracking-widest font-bold ml-1">
                    Explorar Restaurantes
                 </Text>
              </View>
            )}

            <View className="px-4 mb-4">
               <Text className="text-xl font-bold text-gray-900">
                  {activeTab === 'all' || !isCompany ? 'Descobrir' : 'Seus Favoritos'}
               </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-4">
            <RestaurantCard 
              restaurant={item} 
              isFavorited={favorites.some(fav => fav.id === item.id)}
              onToggleFavorite={toggleFavorite}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-6" />}
        ListEmptyComponent={() => (
          <View className="items-center mt-12 px-10">
            <View className="bg-gray-50 p-6 rounded-full mb-4">
               <Ionicons name={activeTab === 'favorites' ? "heart-dislike-outline" : "search-outline"} size={48} color="#D1D5DB" />
            </View>
            <Text className="text-gray-400 font-medium text-center">
              {activeTab === 'favorites' 
                ? "Você ainda não favoritou nenhum restaurante." 
                : "Nenhum restaurante encontrado."}
            </Text>
          </View>
        )}
        ListFooterComponent={() => <View className="h-20" />}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
