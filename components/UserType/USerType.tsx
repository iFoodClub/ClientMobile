import React from "react";
import { Text, View } from "react-native";

type UserTypeProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

const USerType = ({ icon, label, active = true }: UserTypeProps) => {
  return (
    <View
      className={`border flex flex-col items-center justify-center rounded-lg text-base  w-40 h-48 ${
        active ? "bg-orange-50 border-primary" : "bg-white"
      }`}
    >
      <View className="">{icon}</View>
      <Text
        className={`mt-2 text-lg ${active ? "text-primary" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </View>
  );
};

export default USerType;
