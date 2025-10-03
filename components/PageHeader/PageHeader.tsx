import React from "react";
import { Text, View } from "react-native";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <View className="mb-6">
      <Text className="text-h1 font-semibold">{title}</Text>
      {subtitle && <Text className="caption text-gray-400">{subtitle}</Text>}
    </View>
  );
};

export default PageHeader;
