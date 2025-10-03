import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantCard from "@/components/Restaurant/Components/RestaurantCard/RestaurantCard";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView>
      <PageHeader
        title="Restaurantes"
        subtitle="Navegue entre nossos restaurantes parceiros"
      />

      {user && (
        <View className="flex flex-row gap-x-8 flex-wrap px-2 gap-y-8 ">
          <RestaurantCard
            id={user.id}
            image={user.profileImage}
            name={user.name}
          />
          <RestaurantCard
            id={user.id}
            image={user.profileImage}
            name={user.name}
          />
          <RestaurantCard
            id={user.id}
            image={user.profileImage}
            name={user.name}
          />
          <RestaurantCard
            id={user.id}
            image={user.profileImage}
            name={user.name}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
