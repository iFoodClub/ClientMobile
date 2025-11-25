import { COLORS } from "@/src/constants/colors";
import { useOrders } from "@/src/hooks/useOrders";
import { IRestaurantOrdersResponse } from "@/src/interfaces/apiResponses";
import { useAuthStore } from "@/src/store/authStore";
import { formatPrice } from "@/src/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";

const RestaurantOrders = () => {
  const { user } = useAuthStore();
  const { getRestaurantOrders, restaurantOrders, isLoading } = useOrders();

  React.useEffect(() => {
    if (user) {
      if (!user?.restaurant?.id) return;
      getRestaurantOrders(user.restaurant.id);
    }
  }, [user]);

  return (
    <FlatList
      className="px-4"
      data={restaurantOrders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => restaurantOrderCard(item)}
      contentContainerStyle={{ paddingVertical: 16, gap: 16 }}
      refreshing={isLoading}
    />
  );
};

export default RestaurantOrders;

function restaurantOrderCard(restaurantOrder: IRestaurantOrdersResponse) {
  return (
    <View
      key={restaurantOrder.id}
      className=" px-4 py-4 rounded-lg bg-white border border-gray-200 "
    >
      <View className="flex flex-row flex-1 justify-between mb-4">
        <View>
          <Text className=" text-lg font-bold  text-primary ">
            {restaurantOrder.code}
          </Text>
        </View>
        {/* <View
          className={`${getOrderBadgeByStatus(
            restaurantOrder.status
          )} px-4 py-2`}
        >
          <Text>{restaurantOrder.status}</Text>
        </View> */}
        <View className="border px-2 py-1 rounded-lg h-fit">
          <Text>{restaurantOrder.status}</Text>
        </View>
      </View>
      <View className="flex flex-row gap-x-2">
        <Text
          style={{ color: COLORS.priceText }}
          className="text-sm text-gray-600 font-semibold"
        >
          Valor total dos pedidos
        </Text>
        <Ionicons name="cash-outline" size={16} color={COLORS.priceText} />
        <Text
          style={{ color: COLORS.priceText }}
          className="text-sm text-gray-600 font-semibold"
        >
          {formatPrice(restaurantOrder.totalPrice)}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-x-2">
        <Text>Pratos:</Text>
        <Ionicons
          name="restaurant-outline"
          className="flex align-middle justify-center"
          size={14}
          color={COLORS.textDescription}
        />
        <Text className="text-lg font-bold text-textDescription">
          {restaurantOrder.employeeOrders.length}
        </Text>
      </View>
    </View>
  );
}
