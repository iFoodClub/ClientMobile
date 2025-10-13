import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Modal as RNModal,
  Text,
  View,
} from "react-native";

type ModalCustomProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
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
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-4"
        onPress={onClose}
      >
        <Pressable className="bg-white rounded-lg w-full max-w-md shadow-xl">
          <View className="flex-row justify-between items-center p-4 ">
            <Text className="text-lg font-bold text-gray-800">{title}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <AntDesign name="close" size={22} color="#6B7280" />
            </Pressable>
          </View>

          <View className="p-6">{children}</View>

          <View className="flex-row justify-end items-center gap-x-2 p-4 ">
            <Pressable
              onPress={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md border border-primary text-primary"
            >
              <Text className="font-semibold text-primary">{cancelText}</Text>
            </Pressable>

            {onConfirm && (
              <Pressable
                onPress={onConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-md bg-primary flex-row items-center ${
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
                <Text className="font-semibold text-white">{confirmText}</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

export default ModalCustom;
