import PressableButton from "@/components/Button/PressableButton";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import CModal from "@/components/ui/Modal/CModal";
import { useToastAll } from "@/src/components/Toast";
import { COLORS } from "@/src/constants/colors";
import { useSelectedRestaurant } from "@/src/hooks/useSelectedRestaurant";
import { IDish } from "@/src/interfaces/apiResponses";
import { dayNamesPT, DayOfWeek, UserType } from "@/src/interfaces/interfaces";
import CompanyRepository from "@/src/repository/companyRepository";
import employeeRepository from "@/src/repository/employeeRepository";
import { useAuthStore } from "@/src/store/authStore";
import { formatPrice } from "@/src/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "@/src/hooks/useFavorites";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const RestaurantDetails = () => {
  const [open, setOpen] = useState(false);
  const { showSuccess, showError } = useToastAll();
  const { id } = useLocalSearchParams();
  const [selectedDish, setSelectedDish] = useState<IDish | null>(null);
  const { selectedRestaurant, loading } = useSelectedRestaurant({
    restaurantId: Number(id),
  });
  const { token, user, updateSelectedRestaurant, isEmployee } = useAuthStore();
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some(f => f.id === Number(id));

  function handleCancel() {
    setOpen(false);
  }

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

  function handleLongPress(dish: IDish): void {
    {
      if (isEmployee) {
        setOpen(true);
        setSelectedDish(dish);
      }
    }
  }

  async function handleEmployeeWeeklyOrder(day: DayOfWeek) {
    if (!selectedDish || !day || !user?.employee?.id) return;

    const employeeWeeklyOrder = {
      employeeId: user.employee.id,
      dayOfWeek: day,
      order: {
        dishId: selectedDish.id,
        quantity: 1,
      },
    };

    try {
      await employeeRepository.selectWeeklyOrderDay(employeeWeeklyOrder);
      showSuccess(`Prato definido para ${dayNamesPT[day]}`);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <PressableButton
        className="absolute top-14 left-4 z-10"
        icon={<AntDesign name="arrow-left" size={14} color="white" />}
        onPress={handleBkackPress}
      />
      {user?.userType === UserType.company && (
        <PressableButton
          className="absolute top-14 right-4 z-10"
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

      {/* Botão de Favorito - Apenas para Empresas */}
      {user?.userType === UserType.company && (
        <PressableButton
          className={`absolute top-14 ${user?.userType === UserType.company ? 'right-20' : 'right-4'} z-10`}
          icon={
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={22} 
              color={isFavorite ? COLORS.primary : "white"} 
            />
          }
          onPress={() => toggleFavorite(Number(id))}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          className="w-full h-40"
          source={{ uri: selectedRestaurant?.profileImage }}
        />

        <View className="-mt-6">
          <View className="w-11/12 mx-auto pb-6 bg-white rounded-3xl border border-gray-100 ">
            <Image
              className="w-24 h-24 rounded-full border-4 border-white object-cover absolute -top-12 z-10 left-1/2 -ml-12"
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
                  <Text className="text-textDescription">{`(${selectedRestaurant?.restaurantRatings.length} avaliações)`}</Text>
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

        <View className="pt-6 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold text-textBody">
              Pratos
            </Text>
            {isEmployee && selectedRestaurant?.dishes && selectedRestaurant.dishes.length > 0 && (
              <Text className="text-gray-400 text-xs italic">
                💡 Toque e segure para definir pedido semanal
              </Text>
            )}
          </View>
          <View className="flex flex-row flex-wrap gap-8">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <DishCardSkeleton key={index} />
              ))}
            {selectedRestaurant?.dishes?.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onLongPress={() => handleLongPress(dish)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <CModal
        subtitle="Essa escolha será utilizada para definir seu pedido semanal (Que irá ser feito automaticamente )"
        confirmText={"Escolher"}
        onClose={handleCancel}
        loading={false}
        modalVisible={open}
        setModalVisible={setOpen}
        title={"Para qual dia deseja definir o  prato"}
      >
        <View>
          <View className="flex flex-row flex-wrap gap-4 mx-auto w-10/12 justify-between ">
            {Object.values(DayOfWeek).map((day) => (
              <Pressable
                className="py-2 border px-4 rounded-lg w-2/5 bg-primary border-primary flex items-center justify-center "
                key={day}
                onPress={() => {
                  handleEmployeeWeeklyOrder(day);
                }}
              >
                <Text className="text-white text-base">{dayNamesPT[day]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </CModal>
    </View>
  );
};

export default RestaurantDetails;
