import Badge from "@/components/Badge/Badge";
import CModal from "@/components/ui/Modal/CModal";
import { COLORS } from "@/src/constants/colors";
import {
  IRestaurantOrdersResponse,
  OrderStatus,
} from "@/src/interfaces/apiResponses";
import { formatPrice } from "@/src/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

type RestaurantOrderCardProps = {
  restaurantOrder: IRestaurantOrdersResponse;
  updateCompanyOrder: (
    restaurantId: number,
    orderId: number,
    status: string
  ) => Promise<void>;
};

const RestaurantOrderCard = ({
  restaurantOrder,
  updateCompanyOrder,
}: RestaurantOrderCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  function handleUpdateCompanyOrder() {
    console.log(restaurantOrder.status === OrderStatus.SENT);

    const nextStatus =
      restaurantOrder.status === OrderStatus.SENT ? "preparing" : "delivered";
    updateCompanyOrder(
      restaurantOrder.restaurantId,
      restaurantOrder.id,
      nextStatus
    );
  }

  return (
    <Pressable onPress={() => setModalOpen(true)}>
      <View
        key={restaurantOrder.id}
        className="px-4 py-4 rounded-lg bg-white border border-gray-200"
      >
        <View className="flex flex-1 ">
          <View>
            <View className="flex flex-row flex-1 justify-between mb-4">
              <View>
                <Text className="text-lg font-bold text-primary">
                  {restaurantOrder.code}
                </Text>
              </View>

              <Badge status={restaurantOrder.status} />
            </View>
            <View className="flex flex-row gap-x-2">
              <Text
                style={{ color: COLORS.priceText }}
                className="text-sm text-gray-600 font-semibold"
              >
                Valor total dos pedidos
              </Text>
              <Ionicons
                name="cash-outline"
                size={16}
                color={COLORS.priceText}
              />
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

              <CModal
                modalVisible={modalOpen}
                setModalVisible={setModalOpen}
                cancelText="Voltar"
                title={
                  <View>
                    <Text className="text-lg text-textDescription">
                      Detalhes do pedido:
                    </Text>
                    <Text className="text-lg font-bold">
                      {restaurantOrder.code}
                    </Text>
                  </View>
                }
                onClose={() => setModalOpen(false)}
              >
                <View style={{ maxHeight: 300 }}>
                  <FlatList
                    data={restaurantOrder.employeeOrders}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ gap: 8 }}
                    renderItem={({ item: order }) => (
                      <View
                        key={order.id}
                        className="flex flex-row justify-between px-3 py-3 border border-gray-200 rounded-lg"
                      >
                        <View className="flex flex-row items-center gap-x-3">
                          <Image
                            source={{ uri: order?.employee?.image }}
                            className="w-10 h-10 rounded-full"
                          />

                          <View>
                            <Text className="text-sm font-medium text-gray-800">
                              {order?.employee?.name}
                            </Text>
                            <Text
                              className="text-lg font-medium text-gray-700"
                              numberOfLines={1}
                            >
                              {order.dish.name}
                            </Text>
                          </View>
                        </View>

                        <View className="flex flex-row items-center gap-x-3">
                          <Text
                            style={{ color: COLORS.primary }}
                            className="text-lg font-bold text-gray-700"
                          >
                            1 x{" "}
                          </Text>
                          <Image
                            source={{ uri: order?.dish?.image }}
                            className="w-16 h-16 rounded-md"
                          />
                        </View>
                      </View>
                    )}
                  />
                </View>
              </CModal>
            </View>
          </View>
        </View>
        <View className="flex flex-row flex-1 mt-4 ">
          <Pressable
            className="px-4 py-2 bg-primary rounded-lg h-10 flex-row items-center justify-center w-32 gap-x-2"
            onPress={() => handleUpdateCompanyOrder()}
          >
            <MaterialIcons name="update" size={18} color="white" />
            <Text className="text-white font-medium">Atualizar</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default RestaurantOrderCard;
