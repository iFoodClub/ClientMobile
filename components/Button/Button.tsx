import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
};

const Button = ({
  onPress,
  text,
  disabled = false,
  icon,
  className,
  loading,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const finalClassName = `
    px-4 py-4 bg-primary rounded-lg flex-row items-center justify-center w-full 
    ${isDisabled ? "opacity-70" : ""} 
    ${className}
  `;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={finalClassName}
    >
      <View className="relative flex-row items-center">
        {icon && !loading && icon}

        <Text
          className={`text-white font-semibold text-body ${
            icon && !loading ? "ml-2" : ""
          }`}
        >
          {text}
        </Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color="white"
            className="absolute left-full ml-2"
          />
        )}
      </View>
    </Pressable>
  );
};

export default Button;
