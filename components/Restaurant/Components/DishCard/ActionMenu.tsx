import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ActionMenuProps = {
  position: { x: number; y: number };
  onEdit: () => void;
  onDelete: () => void;
};

export const ActionMenu = ({ position, onEdit, onDelete }: ActionMenuProps) => {
  return (
    <View
      style={[
        styles.menuContainer,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    >
      {/* Botão de Editar */}
      <TouchableOpacity
        onPress={onEdit}
        style={[styles.button, styles.editButton]}
      >
        <Feather name="edit-2" size={20} color="white" />
      </TouchableOpacity>

      {/* Botão de Excluir */}
      <TouchableOpacity
        onPress={onDelete}
        style={[styles.button, styles.deleteButton]}
      >
        <Feather name="trash-2" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    flexDirection: "row",
    gap: 16,
    // Leve ajuste para o menu aparecer acima do dedo, e não embaixo
    transform: [{ translateX: -40 }, { translateY: -60 }],
    zIndex: 10,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25, // Metade da largura/altura para fazer um círculo
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButton: {
    backgroundColor: "#3b82f6", // Azul
  },
  deleteButton: {
    backgroundColor: "#ef4444", // Vermelho
  },
});
