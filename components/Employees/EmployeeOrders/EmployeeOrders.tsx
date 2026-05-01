import { useOrders } from "@/src/hooks/useOrders";
import { useAuthStore } from "@/src/store/authStore";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { ChoiceCard } from "./ChoiceCard";

const EmployeeOrders = () => {
  const { user } = useAuthStore();
  const {
    getEmployeeWeeklyOrders,
    employeeChoices,
    removeEmployeeChoice,
    isLoading,
  } = useOrders();

  useEffect(() => {
    if (!user?.employee?.id) return;
    getEmployeeWeeklyOrders(user.employee.id);
  }, [getEmployeeWeeklyOrders, user?.employee?.id]);

  return (
    <View className="px-6 mt-4">
      <Text className="text-2xl font-bold  text-textDescription mb-6">
        Pedidos semanais
      </Text>

      <FlatList
        data={employeeChoices}
        numColumns={3}
        columnWrapperStyle={{ gap: 16 }}
        keyExtractor={(item) => item.dayOfWeek}
        renderItem={({ item }) => (
          <ChoiceCard
            choice={item}
            day={item.dayOfWeek}
            removeEmployeeChoice={removeEmployeeChoice}
            isLoading={isLoading}
          />
        )}
      />
    </View>
  );
};

export default EmployeeOrders;
