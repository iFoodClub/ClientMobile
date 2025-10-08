import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

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
  loading,
}: ButtonProps) => {
  const defaultClassName = `px-4 py-4 bg-primary rounded-lg flex-row items-center justify-center w-full`;

  return (
    <TouchableOpacity onPress={onPress} className={defaultClassName}>
      {icon && icon}
      <Text className="text-white font-semibold text-body">{text}</Text>
      {loading && <ActivityIndicator size="small" color="white" />}
    </TouchableOpacity>
  );
};

export default Button;
