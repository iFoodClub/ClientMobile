import { CustomButtonProps } from "@/type";
import cn from "clsx";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const CustomButton = (props: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={cn("custom-btn", props.style)}
      onPress={props.onPress}
    >
      {props.leftIcon}

      <View className="flex-center flex-row">
        {props.isLoading ? (
          <ActivityIndicator size={"small"} color={"#fff"} />
        ) : (
          <Text
            className={cn("text-white-100 paragraph-semibold", props.textStyle)}
          >
            {props.title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
