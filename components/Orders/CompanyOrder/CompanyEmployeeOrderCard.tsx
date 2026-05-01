import { COLORS } from "@/src/constants/colors";
import { IEmployeeOrder } from "@/src/interfaces/apiResponses";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

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
    <View className="flex flex-row gap-x-4 gap-y-4">
      <Image
        source={{ uri: employeeOrder.profileImage }}
        className="rounded-full w-12 h-12"
      />
      <View className="flex grow">
        <Text className="font-bold text-lg">{employeeOrder.name}</Text>
        {!isEmployeeWithoutOrder && (
          <Text className="text-lg text-textDescription">
            {employeeOrder?.order[0]?.name}
          </Text>
        )}
        {isEmployeeWithoutOrder && (
          <Text className="text-lg text-textDescription">Não pediu</Text>
        )}
      </View>
      {!isEmployeeWithoutOrder && (
        <Image
          className="rounded-lg"
          height={60}
          width={60}
          source={{ uri: employeeOrder?.order[0]?.image }}
        />
      )}
      {isEmployeeWithoutOrder && (
        <View className="w-[60px] flex items-center justify-center ">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

export default CompanyEmployeeOrderCard;
