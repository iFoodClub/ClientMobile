import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from "react-native";
import Toast from "react-native-root-toast";
import { Message, useChatStore } from "../src/store/chatStore";

export default function ChatbotModal() {
  const isModalVisible = useChatStore((state) => state.isModalVisible);
  const closeModal = useChatStore((state) => state.closeModal);
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const clearHistory = useChatStore((state) => state.clearHistory);

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList<Message>>(null);

  // Rola para o final da lista sempre que uma nova mensagem chega ou o bot começa a digitar
  useEffect(() => {
    if (isModalVisible) {
      // Pequeno delay para garantir que o layout da FlatList foi renderizado
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isTyping, isModalVisible]);

  // Envia a mensagem do usuário
  const handleSend = () => {
    if (inputText.trim() === "") return;
    sendMessage(inputText.trim());
    setInputText("");
    Keyboard.dismiss(); // Fecha o teclado imediatamente ao enviar!
  };

  // Simula o acionamento de voz para a entrega final
  const handleVoicePress = () => {
    Toast.show("🎙️ Busca por voz com PLN será integrada nesta seção na Entrega Final! ([US56])", {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: "#EF4444",
      textColor: "#FFFFFF"
    });
  };

  // Formata o texto para renderizar negrito (**texto**) de maneira nativa e premium
  const renderMessageText = (text: string, isUser: boolean) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    const textClass = isUser ? "text-white" : "text-gray-800";
    const boldClass = isUser ? "font-bold text-white" : "font-bold text-gray-900";

    return (
      <Text className={`text-[14px] leading-5 ${textClass}`}>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return (
              <Text key={index} className={boldClass}>
                {part}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  // Renderiza cada mensagem individualmente
  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    return (
      <View className={`flex-row ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-2 self-end">
            <Ionicons name="hardware-chip-outline" size={18} color="#EF4444" />
          </View>
        )}
        <View
          className={`max-w-[75%] p-3.5 rounded-2xl ${isUser
            ? "bg-primary rounded-br-none"
            : "bg-gray-100 rounded-bl-none border border-gray-200/50"
            }`}
          style={{
            elevation: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 1
          }}
        >
          {renderMessageText(item.text, isUser)}
          <Text
            className={`text-[9px] mt-1 text-right ${isUser ? "text-red-100" : "text-gray-400"
              }`}
          >
            {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
      statusBarTranslucent={false}
    >
      <View className="flex-1 justify-end bg-black/60">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          className="w-full justify-end"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <SafeAreaView className="h-[85%] w-full bg-white rounded-t-[32px] overflow-hidden">
            <View className="flex-1">
              {/* CABEÇALHO PREMIUM DO CHAT */}
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
                <View className="flex-row items-center">
                  <View className="relative">
                    <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center border border-red-100">
                      <Ionicons name="chatbubbles" size={20} color="#EF4444" />
                    </View>
                    <View className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-gray-900 font-bold text-base leading-5">Assistente iFoodClub</Text>
                    <Text className="text-emerald-500 text-xs font-semibold">Online • Resposta Instantânea</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-x-3">
                  {/* Botão de Limpar Histórico */}
                  <Pressable
                    onPress={clearHistory}
                    hitSlop={10}
                    className="w-8 h-8 rounded-full items-center justify-center bg-gray-50 active:bg-gray-100"
                  >
                    <Feather name="trash-2" size={16} color="#6B7280" />
                  </Pressable>

                  {/* Botão de Fechar */}
                  <Pressable
                    onPress={closeModal}
                    hitSlop={10}
                    className="w-8 h-8 rounded-full items-center justify-center bg-gray-50 active:bg-gray-100"
                  >
                    <Ionicons name="close" size={20} color="#374151" />
                  </Pressable>
                </View>
              </View>

              {/* ÁREA DAS MENSAGENS */}
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                className="flex-1 bg-gray-50/50"
                ListFooterComponent={() => {
                  if (!isTyping) return null;
                  return (
                    <View className="flex-row justify-start mb-4">
                      <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-2 self-end">
                        <Ionicons name="hardware-chip-outline" size={18} color="#EF4444" />
                      </View>
                      <View className="bg-gray-100 p-3.5 rounded-2xl rounded-bl-none border border-gray-200/50 flex-row items-center gap-x-1.5">
                        <View className="w-2 h-2 bg-gray-400 rounded-full" style={{ opacity: 0.4 }} />
                        <View className="w-2 h-2 bg-gray-400 rounded-full" style={{ opacity: 0.7 }} />
                        <View className="w-2 h-2 bg-gray-400 rounded-full" style={{ opacity: 1 }} />
                        <Text className="text-xs text-gray-500 font-medium ml-1">Assistente digitando...</Text>
                      </View>
                    </View>
                  );
                }}
              />

              {/* BARRA DE INPUT E ENVIAR */}
              <View className="p-4 border-t border-gray-100 bg-white flex-row items-center gap-x-2">
                {/* Botão de Busca por Voz (Placeholder US56) */}
                <Pressable
                  onPress={handleVoicePress}
                  className="w-11 h-11 bg-gray-100 rounded-full items-center justify-center active:bg-gray-200"
                >
                  <Feather name="mic" size={20} color="#4B5563" />
                </Pressable>

                {/* Input de Texto */}
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 border border-gray-200/50">
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Como posso te ajudar hoje?"
                    placeholderTextColor="#9CA3AF"
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                    className="flex-1 py-3 text-sm text-gray-800"
                  />
                </View>

                {/* Botão Enviar */}
                <Pressable
                  onPress={handleSend}
                  disabled={inputText.trim() === ""}
                  className={`w-11 h-11 rounded-full items-center justify-center ${inputText.trim() === "" ? "bg-gray-200" : "bg-primary active:opacity-90"
                    }`}
                >
                  <Ionicons
                    name="send"
                    size={16}
                    color={inputText.trim() === "" ? "#9CA3AF" : "white"}
                    style={{ marginLeft: 2 }}
                  />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
