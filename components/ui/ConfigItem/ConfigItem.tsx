import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ConfigItemProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  showBadge?: boolean;
};

const ConfigItem = ({ icon, label, onPress, showBadge }: ConfigItemProps) => {
  return (
    <Pressable
      className="flex flex-row items-center justify-between py-5"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="mr-5 relative">
          {icon}
          {showBadge && (
            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
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
