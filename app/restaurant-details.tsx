import PressableButton from "@/components/Button/PressableButton";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import { useToastAll } from "@/src/components/Toast";
import { COLORS } from "@/src/constants/colors";
import { useSelectedRestaurant } from "@/src/hooks/useSelectedRestaurant";
import { UserType } from "@/src/interfaces/interfaces";
import CompanyRepository from "@/src/repository/companyRepository";
import { useAuthStore } from "@/src/store/authStore";
import { formatPrice } from "@/src/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const RestaurantDetails = () => {
  const { showSuccess } = useToastAll();

  const { id } = useLocalSearchParams();
  const { selectedRestaurant } = useSelectedRestaurant({
    restaurantId: Number(id),
  });
  const { token, user, updateSelectedRestaurant } = useAuthStore();

  function handleBkackPress() {
    router.push({
      pathname: "/",
    });
  }

  async function handleChooseRestaurant() {
    try {
      if (!selectedRestaurant || !user || !user.company) return;
      const response = await CompanyRepository.updateCompanySelectedRestaurant(
        user.company.id,
        {
          userId: user.id,
          name: user.name,
          cnpj: user.company.cnpj,
          cep: user.company.cep,
          number: user.company.number,
          restaurantId: selectedRestaurant.id,
        }
      );
      user.company.restaurantId = selectedRestaurant.id;
      updateSelectedRestaurant(selectedRestaurant.id);
      showSuccess("Restaurante escolhido com sucesso!");
    } catch (error) {
      console.error(error);
    }
  }

  const cheapeastDishes = selectedRestaurant?.dishes.reduce(
    (prev, current) => (prev.price < current.price ? prev : current),
    selectedRestaurant?.dishes[0]
  );

  return (
    <View className="relative">
      <PressableButton
        className="absolute top-10 left-4 z-10"
        icon={<AntDesign name="arrow-left" size={14} color="white" />}
        onPress={handleBkackPress}
      />
      {user?.userType === UserType.company && (
        <PressableButton
          className="absolute top-10 right-4 z-10"
          icon={
            user?.company?.restaurantId === selectedRestaurant?.id ? (
              <Ionicons name="restaurant" size={20} color="white" />
            ) : (
              <Ionicons name="restaurant-outline" size={20} color="white" />
            )
          }
          onPress={handleChooseRestaurant}
        />
      )}
      <Image
        className="w-full h-40"
        source={{ uri: selectedRestaurant?.profileImage }}
      />
      <View className="absolute top-36 w-full">
        <View className="w-11/12 mx-auto pb-6 bg-white rounded-3xl border border-gray-100 ">
          <Image
            className="
            w-24 h-24 rounded-full border-4 border-white object-cover absolute -top-12 z-10  left-1/2 -ml-12
          "
            source={{ uri: selectedRestaurant?.profileImage }}
          />

          <View className="pt-12 px-4">
            <View className="mb-2 border-b pb-2 border-gray-200">
              <Text className="text-2xl font-semibold text-textBody">
                {selectedRestaurant?.name}
              </Text>
              <View className="flex flex-row gap-x-1 ">
                <AntDesign
                  name="star"
                  size={12}
                  color={COLORS.starsRating}
                  className="flex align-middle justify-center"
                />
                <Text
                  className="font-semibold"
                  style={{ color: COLORS.starsRating }}
                >
                  {selectedRestaurant?.averageRating}
                </Text>
                <Text className="text-textDescription">{`(${selectedRestaurant?.restaurantRatings.length} avaliações)`}</Text>
              </View>
            </View>
            <View className="flex flex-row gap-x-4">
              <View className="flex flex-row gap-x-4 ">
                <View className="flex flex-row gap-x-1">
                  <Ionicons
                    name="restaurant-outline"
                    className="flex align-middle justify-center"
                    size={14}
                    color={COLORS.textDescription}
                  />
                  <Text className="text-textDescription">
                    Pratos:{" "}
                    <Text className="font-semibold">
                      {selectedRestaurant?.dishes.length}
                    </Text>
                  </Text>
                </View>
              </View>
              <View className="flex align-middle flex-row gap-x-2 ">
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color={COLORS.priceText}
                />
                <Text
                  style={{ color: COLORS.priceText }}
                  className="text-sm text-gray-600 font-semibold"
                >
                  Pratos a partir de {formatPrice(cheapeastDishes?.price)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="pt-6 px-8 border-t border-gray-200 absolute top-80 border w-full ">
        <Text className="text-xl font-semibold text-textBody mb-4">Pratos</Text>
        <View className="flex flex-row flex-wrap gap-x-8">
          {selectedRestaurant?.dishes?.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default RestaurantDetails;
