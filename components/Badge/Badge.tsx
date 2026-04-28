import React from "react";
import { Text, View } from "react-native";

type BadgeProps = {
  status: "Enviado" | "Entregue" | "Preparando" | string;
  className?: string;
};

const Badge = ({ status, className }: BadgeProps) => {
  let bg = "bg-gray-500/20";
  let border = "border-gray-500";
  let textColor = "text-gray-700";
  let displayText = status; // texto exibido no badge

  switch (status) {
    case "Enviado":
      bg = "bg-yellow-500/20";
      border = "border-yellow-500";
      textColor = "text-yellow-700";
      displayText = "Recebido"; // <-- alteração aqui
      break;

    case "Preparando":
      bg = "bg-blue-500/20";
      border = "border-blue-500";
      textColor = "text-blue-700";
      displayText = "Preparando";
      break;

    case "Entregue":
      bg = "bg-green-500/20";
      border = "border-green-500";
      textColor = "text-green-700";
      displayText = "Entregue";
      break;

    default:
      displayText = status;
      break;
  }

  return (
    <View
      className={`px-2 py-1 rounded-md border ${bg} ${border} ${
        className ?? ""
      }`}
    >
      <Text className={`text-sm font-medium ${textColor}`}>{displayText}</Text>
    </View>
  );
};

export default Badge;
