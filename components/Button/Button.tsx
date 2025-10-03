import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

const Button = ({ onPress, text, disabled = false, icon }: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`px-4 py-4 ${
        disabled ? "bg-gray-200" : "bg-primary"
      } rounded-lg flex items-center w-full`}
    >
      {icon && icon}
      <Text className="text-white font-semibold text-body">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
