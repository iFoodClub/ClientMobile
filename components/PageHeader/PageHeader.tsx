import React from "react";
import { Text, View } from "react-native";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

const PageHeader = ({ title, subtitle, className }: PageHeaderProps) => {
  return (
    <View className="my-10 ml-8">
      <Text className="text-h1 font-semibold text-textBody">{title}</Text>
      {subtitle && (
        <Text className="caption text-textDescription">{subtitle}</Text>
      )}
    </View>
  );
};

export default PageHeader;
