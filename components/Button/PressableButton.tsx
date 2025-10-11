import React from "react";
import { Pressable, Text } from "react-native";

type PressableButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  text?: string;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
};

const PressableButton = ({
  onPress,
  text,
  icon,
  className,
  loading,
  ...props
}: PressableButtonProps) => {
  return (
    <Pressable
      className={`flex-row items-center justify-center bg-primary p-3 rounded-full self-start ${className}`}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <Text className="text-white font-semibold text-body">
          Carregando...
        </Text>
      ) : (
        icon
      )}

      {text && (
        <Text
          className={`${icon ? "ml-2" : ""} text-white font-semibold text-body`}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default PressableButton;
