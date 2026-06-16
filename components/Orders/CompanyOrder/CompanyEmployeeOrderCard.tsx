import { COLORS } from "@/src/constants/colors";
import { IEmployeeOrder } from "@/src/interfaces/apiResponses";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Image, Text, View } from "react-native";

type CompanyEmployeeOrderCardProps = {
  employeeOrder: IEmployeeOrder;
  employeesWithoutOrder: IEmployeeOrder[];
};

const CompanyEmployeeOrderCard = ({
  employeeOrder,
  employeesWithoutOrder,
}: CompanyEmployeeOrderCardProps) => {

  const isEmployeeWithoutOrder = employeesWithoutOrder.some(
    (employee) => employee.id === employeeOrder.id
  );

  return (
    <View 
      className={`flex-row items-center bg-white rounded-2xl p-4 mb-3 border ${
        isEmployeeWithoutOrder ? "border-gray-100" : "border-primary/10"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3.84,
        elevation: 2,
      }}
    >
      {/* Imagem do Colaborador */}
      <Image
        source={{ uri: employeeOrder.profileImage }}
        className="rounded-full w-12 h-12 border border-gray-100"
      />
      
      {/* Informações */}
      <View className="flex-1 ml-4 justify-center">
        <Text className="font-bold text-gray-900 text-base">{employeeOrder.name}</Text>
        
        {/* Status / Prato */}
        {!isEmployeeWithoutOrder ? (
          <View className="flex-row items-center mt-1">
            <View className="bg-green-50 px-2 py-0.5 rounded-md mr-2 flex-row items-center">
              <MaterialCommunityIcons name="check-circle" size={12} color="#10B981" />
              <Text className="text-green-700 font-semibold text-[10px] ml-1">Escolhido</Text>
            </View>
            <Text className="text-gray-500 text-xs flex-1" numberOfLines={1}>
              {employeeOrder?.order[0]?.name}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center mt-1">
            <View className="bg-amber-50 px-2 py-0.5 rounded-md mr-2 flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={12} color="#D97706" />
              <Text className="text-amber-700 font-semibold text-[10px] ml-1">Pendente</Text>
            </View>
            <Text className="text-gray-400 text-xs">Aguardando escolha</Text>
          </View>
        )}
      </View>

      {/* Visual da Escolha ou Ícone de Espera Estático */}
      {!isEmployeeWithoutOrder ? (
        <Image
          className="rounded-xl w-14 h-14 border border-gray-100"
          source={{ uri: employeeOrder?.order[0]?.image }}
        />
      ) : (
        <View className="w-14 h-14 bg-gray-50 rounded-xl items-center justify-center border border-dashed border-gray-200">
          <MaterialCommunityIcons name="food-off-outline" size={22} color="#9CA3AF" />
        </View>
      )}
    </View>
  );
};

export default CompanyEmployeeOrderCard;
