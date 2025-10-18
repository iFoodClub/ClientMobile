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

  const finalClassName = ` px-4 py-2 h-14 bg-primary rounded-lg flex-row items-center justify-center w-full
  ${isDisabled ? "opacity-70" : ""}
  ${className}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`${finalClassName} ${
        type === "primary" ? "bg-primary" : "bg-white border border-primary"
      }  ${className}`}
    >
      <View className="relative flex-row items-center">
        {icon && !loading && icon}

        <Text
          className={`${
            type === "primary" ? "text-white" : "text-primary"
          } font-semibold text-body ${icon && !loading ? "ml-2" : ""}`}
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
