import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import RestaurantCardSkeleton from "@/components/Restaurant/Components/RestaurantCard/RestaurantCardSkeleton";
import { useFetchRestaurants } from "@/src/hooks/useRestaurants";
import { IRestaurantResponse } from "@/src/interfaces/apiResponses";
import { useAuthStore } from "@/src/store/authStore";
import React, { useEffect } from "react";
// Importe os componentes necessários
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { restaurants, loading, error } = useFetchRestaurants();
  const { user, isEmployee } = useAuthStore();

  const [selectedRestaurant, setSelectedRestaurant] = React.useState<
    IRestaurantResponse[] | null
  >(null);

  const temporaryUser = {
    ...user,
    employee: {
      ...user?.employee,
      company: {
        ...user?.employee?.company,
        id: user?.employee?.companyId,
        selectedRestaurantId: 2,
      },
    },
  };

  useEffect(() => {
    if (!isEmployee) return;
    const selectedRestaurant = restaurants.filter(
      (r) => r.id === temporaryUser.employee.company.selectedRestaurantId
    );
    setSelectedRestaurant(selectedRestaurant);
  }, [restaurants, user]);

  // É mais limpo renderizar os skeletons separadamente enquanto os dados carregam
  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 p-4">
        <PageHeader
          title="Restaurantes"
          subtitle="Navegue entre nossos restaurantes parceiros"
        />
        <View className="mt-4 space-y-4 gap-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <PageHeader
        title="Restaurantes"
        subtitle="Navegue entre nossos restaurantes parceiros"
      />

      <FlatList
        data={isEmployee ? selectedRestaurant : restaurants}
        renderItem={({ item }) => (
          <View className="px-4">
            <RestaurantCard restaurant={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={() => (
          <View className="items-center mt-20">
            <Text>Nenhum restaurante encontrado.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
