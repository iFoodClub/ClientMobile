import { OrderStatus } from "@/src/interfaces/interfaces";
import { IWeeklyOrder } from "@/src/interfaces/tempInterface";
import { Text } from "@react-navigation/elements";
import React from "react";
import { Image, View } from "react-native";

interface OrderCardProps {
  orderCode: string;
  restaurant: {
    name: string;
    profileImage: string;
  };
  createdAt: string;
  status: OrderStatus;
  orders: IWeeklyOrder[];
}

export default function OrderCard({
  orderCode,
  restaurant,
  createdAt,
  status,
}: OrderCardProps) {
  return (
    <View className="w-4/5 border h-40">
      <View>
        <Text>{orderCode}</Text>
        <View className={`${getOrderBadgeByStatus(status)} px-4 py-2`}>
          <Text>{status}</Text>
        </View>
      </View>
      <View>
        <View>
          <Text>Pedido em:</Text>
          <View>
            <Image
              source={{ uri: restaurant.profileImage }}
              className="w-12 h-12 rounded-full"
            />
            <Text>{restaurant.name}</Text>
          </View>
        </View>
        <View>
          <Text>Pedido as:</Text>
          <Text>{createdAt}</Text>
        </View>
      </View>
    </View>
  );
}

function getOrderBadgeByStatus(status: OrderStatus) {
  switch (status) {
    case OrderStatus.created:
      return "bg-green-100";
    case OrderStatus.inProgress:
      return "bg-yellow-100";
    case OrderStatus.delivered:
      return "bg-blue-100";
    case OrderStatus.canceled:
      return "bg-red-100";
  }
}
