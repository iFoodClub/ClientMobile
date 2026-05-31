import React from "react";
import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useChatStore } from "../src/store/chatStore";

export default function ChatbotFAB() {
  const openModal = useChatStore((state) => state.openModal);
  const isModalVisible = useChatStore((state) => state.isModalVisible);

  // Se o modal de chat já estiver visível, podemos esconder o FAB para evitar redundância visual
  if (isModalVisible) return null;

  return (
    <View 
      className="absolute bottom-28 right-6 z-50"
      style={{
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      }}
    >
      <Pressable
        onPress={openModal}
        className="w-14 h-14 bg-primary rounded-full items-center justify-center"
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.92 : 1 }],
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="white" />
      </Pressable>
    </View>
  );
}
