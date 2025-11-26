import { useOrders } from "@/src/hooks/useOrders";
import { useAuthStore } from "@/src/store/authStore";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { ChoiceCard } from "./ChoiceCard";

const EmployeeOrders = () => {
  const { user } = useAuthStore();
  const { getEmployeeWeeklyOrders, employeeChoices } = useOrders();

  useEffect(() => {
    if (!user?.employee?.id) return;
    getEmployeeWeeklyOrders(user.employee.id);
  }, []);

  return (
    <View className="px-6 mt-4">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Pedidos semanais
      </Text>

      <FlatList
        data={employeeChoices}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.dayOfWeek}
        renderItem={({ item }) => (
          <ChoiceCard choice={item.dish} day={item.dayOfWeek} />
        )}
      />
    </View>
  );
};

export default EmployeeOrders;
