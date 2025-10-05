import React from "react";
import { Button, View } from "react-native";
import {
  useToastError,
  useToastInfo,
  useToastSuccess,
  useToastWarning,
} from "../Toast";

export const ToastExample: React.FC = () => {
  const { showSuccess } = useToastSuccess();
  const { showError } = useToastError();
  const { showWarning } = useToastWarning();
  const { showInfo } = useToastInfo();

  return (
    <View>
      <Button
        title="Sucesso"
        onPress={() => showSuccess("Operação realizada com sucesso!")}
      />

      <Button
        title="Erro"
        onPress={() => showError("Ocorreu um erro inesperado!")}
      />

      <Button
        title="Aviso"
        onPress={() => showWarning("Atenção: Verifique os dados!")}
      />

      <Button
        title="Informação"
        onPress={() => showInfo("Nova atualização disponível!")}
      />
    </View>
  );
};
