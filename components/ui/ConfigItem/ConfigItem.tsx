import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ConfigItemProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

const ConfigItem = ({ icon, label, onPress }: ConfigItemProps) => {
  return (
    <Pressable
      className="flex flex-row items-center justify-between py-5"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="mr-5">
          {icon}
        </View>
        <Text className="text-gray-600 font-medium text-base">
          {label}
        </Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={20}
        color="#D1D5DB"
      />
    </Pressable>
  );
};

export default ConfigItem;
