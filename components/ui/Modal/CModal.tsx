import Button from "@/components/Button/Button";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type CModalProps = {
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  loading?: boolean;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
};

const CModal = ({
  children,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  loading,
  modalVisible,
  setModalVisible,
  title = "Título",
  subtitle,
}: CModalProps) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={onClose}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <View className="w-[90%] px-6 bg-white py-6 rounded-3xl shadow-lg">
            <View className="mb-6">
              <Text className="text-xl font-bold ">{title}</Text>
              {subtitle && (
                <Text className="text-textDescription">{subtitle}</Text>
              )}
            </View>
            {children}
            <View className="flex flex-row justify-end gap-x-3 mt-10">
              <View className="w-[40%]">
                <Button
                  text={cancelText}
                  onPress={onClose}
                  disabled={loading}
                  type="secondary"
                />
              </View>
              {onConfirm && (
                <View className="w-[40%]">
                  <Button
                    text={confirmText}
                    onPress={onConfirm}
                    loading={loading}
                  />
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CModal;
