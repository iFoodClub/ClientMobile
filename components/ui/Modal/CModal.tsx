import Button from "@/components/Button/Button";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type CModalProps = {
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string | React.ReactNode;
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
          <View className="w-full px-4 bg-white py-10 rounded-xl ">
            <Text className="text-3xl font-semibold mb-8">{title}</Text>
            {children}
            <View className="flex flex-col gap-y-2 mt-6 ">
              <Button
                text={confirmText}
                onPress={onConfirm}
                loading={loading}
              />
              <Button
                text={cancelText}
                onPress={onClose}
                disabled={loading}
                type="secondary"
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CModal;
