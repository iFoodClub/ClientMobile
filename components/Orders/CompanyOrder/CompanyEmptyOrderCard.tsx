import { IEmployeeSimple } from "@/src/interfaces/apiResponses";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

const CompanyEmptyOrderCard = (employee: IEmployeeSimple) => {
  return (
    <View className="flex flex-row gap-x-4 gap-y-4">
      <Image
        source={{ uri: employee.profileImage }}
        className="rounded-full w-12 h-12"
      />
      <View className="flex grow">
        <Text className="font-bold text-lg">{employee.name}</Text>
        <Text className="text-lg text-textDescription">Não escolheu</Text>
      </View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default CompanyEmptyOrderCard;
