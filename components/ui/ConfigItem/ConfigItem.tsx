import { COLORS } from "@/src/constants/colors";
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
      className="flex flex-row items-center justify-between  mb-4 pb-4 border-gray-200"
      onPress={onPress}
    >
      <View className="flex flex-row gap-x-2 items-center ">
        {icon}
        <Text className="text-body font-medium text-textDescription">
          {label}
        </Text>
      </View>
      <MaterialIcons
        name="arrow-forward-ios"
        size={16}
        color={COLORS.textDescription}
      />
    </Pressable>
  );
};

export default ConfigItem;
