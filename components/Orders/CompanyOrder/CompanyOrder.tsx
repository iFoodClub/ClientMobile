import PressableButton from "@/components/Button/PressableButton";
import { useEmployees } from "@/src/hooks/useEmployees";
import { useOrders } from "@/src/hooks/useOrders";
import { useAuthStore } from "@/src/store/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { StyleSheet, View as RNView , ActivityIndicator, Text, View } from "react-native";
import React, { useEffect } from "react";

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

  return (
    <View className="px-6 gap-y-4 flex-1   relative ">
      {/* ── Header card ── */}
      <RNView style={headerStyles.card}>
        {/* Linha do dia */}
        <RNView style={headerStyles.dayRow}>
          <RNView style={headerStyles.iconWrapper}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
          </RNView>
          <RNView style={headerStyles.dayTextGroup}>
            <Text style={headerStyles.dayLabel}>Pedido do dia</Text>
            <Text style={headerStyles.dayName}>{todayName}</Text>
          </RNView>
          {employeesWeeklyOrders && (
            <RNView style={headerStyles.badge}>
              <Text style={headerStyles.badgeText}>
                {chosenEmployees.length}/{employees?.length ?? 0}
              </Text>
            </RNView>
          )}
        </RNView>

        {/* Barra de progresso */}
        {employeesWeeklyOrders && (employees?.length ?? 0) > 0 && (
          <RNView style={headerStyles.progressTrack}>
            <RNView
              style={[
                headerStyles.progressFill,
                {
                  width: `${Math.round(
                    (chosenEmployees.length / (employees?.length ?? 1)) * 100
                  )}%` as any,
                },
              ]}
            />
          </RNView>
        )}

        {/* Legenda */}
        {employeesWeeklyOrders && (
          <Text style={headerStyles.legend}>
            {chosenEmployees.length === 0
              ? "Nenhum funcionário pediu ainda"
              : chosenEmployees.length === employees?.length
              ? "Todos os funcionários já pediram! ✓"
              : `${unchosenEmployees.length} funcionário(s) ainda não pediram`}
          </Text>
        )}
      </RNView>

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

const headerStyles = StyleSheet.create({
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 16,
    gap: 12,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFE8CC",
    alignItems: "center",
    justifyContent: "center",
  },
  dayTextGroup: {
    flex: 1,
    gap: 1,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dayName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    backgroundColor: "#FFE8CC",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 99,
  },
  legend: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
