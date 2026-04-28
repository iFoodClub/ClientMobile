import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Pressable, Text, View } from "react-native";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  backButtonFunction?: () => void;
  className?: string;
};

const PageHeader = ({
  title,
  subtitle,
  backButton,
  backButtonFunction,
  className,
}: PageHeaderProps) => {
  return (
    <View className={`flex flex-col gap-y-4 pt-4 pb-6 pl-4 ${className}`}>
      {backButton && (
        <View>
          <Pressable onPress={backButtonFunction}>
            <AntDesign name="arrow-left" size={24} color="black" />
          </Pressable>
        </View>
      )}
      <View className="">
        <Text className="text-h1 font-semibold text-textBody">{title}</Text>
        {subtitle && (
          <Text className="caption text-textDescription">{subtitle}</Text>
        )}
      </View>
    </View>
  );
};

export default PageHeader;
