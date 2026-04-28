import PressableButton from "@/components/Button/PressableButton";
import { useEmployees } from "@/src/hooks/useEmployees";
import { useOrders } from "@/src/hooks/useOrders";
import { useAuthStore } from "@/src/store/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import CompanyEmployeeOrderCard from "./CompanyEmployeeOrderCard";

export const CompanyOrder = () => {
  const { user } = useAuthStore();
  const { employees, fetchEmployees } = useEmployees(user?.company?.id);
  const {
    getEmployeesWeeklyOrdersCurrentDay,
    employeesWeeklyOrders,
    createCompanyOrder,
    isLoading,
  } = useOrders();

  const chosenEmployees =
    employeesWeeklyOrders?.employees.filter(
      (w) => w.order && w.order.length > 0
    ) || [];

  const unchosenEmployees =
    employeesWeeklyOrders?.employees.filter(
      (w) => !w.order || w.order.length === 0
    ) || [];

  useEffect(() => {
    if (!user?.company?.id) return;
    fetchEmployees();
    getEmployeesWeeklyOrdersCurrentDay(user.company.id);
  }, []);

  const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const todayName = weekDays[new Date().getDay()];

  return (
    <View className="px-6 gap-y-4 flex-1   relative ">
      <View className="flex justify-between w-full">
        <View className="flex flex-row gap-x-2">
          <Text>Pedido dia:</Text>
          <Text className="font-bold text-lg">{todayName}</Text>
        </View>

        {employeesWeeklyOrders && unchosenEmployees && (
          <Text className="text-lg text-textDescription">
            Funcionários que escolheram: {chosenEmployees?.length}/
            {employees?.length}
          </Text>
        )}
      </View>

      {employeesWeeklyOrders?.employees.map((employee) => (
        <CompanyEmployeeOrderCard
          key={employee.id}
          employeeOrder={employee}
          employeesWithoutOrder={unchosenEmployees}
        />
      ))}

      <PressableButton
        disabled={chosenEmployees.length > 0 ? false : true}
        className="absolute bottom-4 right-4"
        text={isLoading ? "" : "Criar pedido"}
        icon={
          isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons
              name="receipt-text-edit-outline"
              size={24}
              color="white"
            />
          )
        }
        onPress={() => {
          if (!user?.company?.id) return;
          createCompanyOrder(user.company.id);
        }}
      />
    </View>
  );
};
