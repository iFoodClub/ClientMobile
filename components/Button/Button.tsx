import React from "react";
import { Text, TouchableOpacity } from "react-native";

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
  const defaultClassName = `px-4 py-4 ${
    disabled ? "bg-gray-200" : "bg-primary"
  } rounded-lg flex items-center w-full`;

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      onPress={onPress}
      className={className || defaultClassName}
    >
      {icon && icon}
      <Text className="text-white font-semibold text-body">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
