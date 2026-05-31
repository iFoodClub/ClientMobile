import PressableButton from "@/components/Button/PressableButton";
import { COLORS } from "@/src/constants/colors";
import { useEmployees } from "@/src/hooks/useEmployees";
import { useOrders } from "@/src/hooks/useOrders";
import { useAuthStore } from "@/src/store/authStore";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
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
  }, [fetchEmployees, getEmployeesWeeklyOrdersCurrentDay, user?.company?.id]);

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

  const totalCount = employees?.length || 0;
  const chosenCount = chosenEmployees.length;
  const progressPercent = totalCount > 0 ? (chosenCount / totalCount) * 100 : 0;

  return (
    <View className="flex-1 bg-white relative px-4 pt-4">
      {/* Card Resumo do Pedido do Dia - Estilo iFood Premium */}
      <View
        className="border border-primary/20 rounded-3xl p-5 mb-5 flex-row items-center justify-between"
        style={{
          backgroundColor: "#FFF3E0",
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 1,
        }}
      >
        <View className="flex-1 pr-4">
          <View className="flex-row items-center gap-x-1.5 mb-1">
            <Feather name="calendar" size={16} color={COLORS.primary} />
            <Text className="text-primary font-bold text-sm">{todayName}</Text>
          </View>
          <Text className="font-extrabold text-gray-900 text-xl">Pedido do Grupo</Text>

          {/* Barra de Progresso elegante */}
          <View className="w-full h-2 bg-gray-200/60 rounded-full mt-3 overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="text-gray-500 text-xs mt-2 font-medium">
            Progresso: {chosenCount} de {totalCount} colaboradores
          </Text>
        </View>

        <View className="bg-primary px-4 py-3 rounded-2xl items-center justify-center">
          <Text className="text-white font-extrabold text-lg">{chosenCount}</Text>
          <Text className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Feitos</Text>
        </View>
      </View>

      <Text className="font-extrabold text-gray-900 text-lg mb-4 ml-1">Status da Equipe</Text>

      {/* Caixa de rolagem com os cartões */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {employeesWeeklyOrders?.employees.map((employee) => (
          <CompanyEmployeeOrderCard
            key={employee.id}
            employeeOrder={employee}
            employeesWithoutOrder={unchosenEmployees}
          />
        ))}

        {(!employeesWeeklyOrders || employeesWeeklyOrders.employees.length === 0) && (
          <View className="items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-2">
            <MaterialCommunityIcons name="account-group-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-base font-semibold">Nenhum funcionário vinculado.</Text>
            <Text className="text-gray-400 text-xs text-center px-6 mt-1">Vincule colaboradores na aba de Funcionários.</Text>
          </View>
        )}
      </ScrollView>

      {/* Botão de Fechar e Enviar no rodapé */}
      <PressableButton
        disabled={chosenEmployees.length > 0 ? false : true}
        className="absolute bottom-16 right-6 shadow-xl"
        text={isLoading ? "" : "Criar pedido do grupo"}
        icon={
          isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons
              name="receipt-text-send"
              size={20}
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
