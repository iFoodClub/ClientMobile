import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal as RNModal,
  ScrollView,
  Text,
  View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type ModalCustomProps = {
  visible: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
};

const ModalCustom = ({
  visible,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancelar",
  loading = false,
}: ModalCustomProps) => {
  return (
    <RNModal
      className="flex flex-1"
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-4"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%", maxWidth: 448 }}
        >
          <Pressable
            style={{ maxHeight: SCREEN_HEIGHT * 0.85 }}
            className="bg-white rounded-lg w-full shadow-xl flex"
          >
            <View className="flex-row justify-between items-center p-4">
              <Text className="text-lg font-bold text-gray-800">{title}</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <AntDesign name="close" size={22} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
            >
              {children}
            </ScrollView>

            <View className="flex-row justify-end items-center gap-x-2 p-4">
              <Pressable
                onPress={onClose}
                disabled={loading}
                className="px-4 py-4 flex-1 text-center rounded-md justify-center border border-primary text-primary"
              >
                <Text className="font-semibold text-primary text-center">
                  {cancelText}
                </Text>
              </Pressable>

              {onConfirm && (
                <Pressable
                  onPress={onConfirm}
                  disabled={loading}
                  className={`px-4 flex-1 py-4 rounded-md bg-primary flex-row items-center justify-center ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  {loading && (
                    <ActivityIndicator
                      size="small"
                      color="white"
                      className="mr-2"
                    />
                  )}
                  <Text className="font-semibold text-white text-center">
                    {confirmText}
                  </Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </RNModal>
  );
};

export default ModalCustom;
