import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean;
};

const Button = ({ onPress, text, disabled = false }: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`px-4 py-4 ${
        disabled ? "bg-gray-200" : "bg-primary"
      } rounded-lg flex items-center w-full`}
    >
      <Text className="text-white font-semibold text-body">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
