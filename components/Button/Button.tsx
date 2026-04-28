import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
  type?: "primary" | "secondary";
};

const Button = ({
  onPress,
  text,
  disabled = false,
  icon,
  className,
  type = "primary",
  loading,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  // Estilos base dependendo do tipo
  const bgStyle = type === "primary" 
    ? (isDisabled ? "bg-gray-200" : "bg-primary") 
    : "bg-white border border-gray-200";
    
  const textColor = type === "primary" 
    ? (isDisabled ? "text-gray-400" : "text-white") 
    : (isDisabled ? "text-gray-300" : "text-gray-700");

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-14 rounded-2xl flex-row items-center justify-center w-full shadow-sm ${bgStyle} ${className}`}
      style={({ pressed }) => [
        { opacity: pressed && !isDisabled ? 0.8 : 1 }
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={type === "primary" ? "white" : "#4B5563"}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${textColor} font-bold text-base`}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default Button;
