import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button/Button';
import {
    useToastDanger,
    useToastError,
    useToastInfo,
    useToastSuccess,
    useToastWarning
} from '../../hooks/useToastHooks';

export const ToastExample: React.FC = () => {
  const { showSuccess } = useToastSuccess();
  const { showError } = useToastError();
  const { showWarning } = useToastWarning();
  const { showInfo } = useToastInfo();
  const { showError: showDanger } = useToastDanger();

  return (
    <View style={styles.container}>
      <Button
        title="Sucesso"
        onPress={() => showSuccess('Operação realizada com sucesso!')}
        style={styles.button}
      />
      
      <Button
        title="Erro"
        onPress={() => showError('Ocorreu um erro inesperado!')}
        style={styles.button}
      />
      
      <Button
        title="Aviso"
        onPress={() => showWarning('Atenção: Verifique os dados!')}
        style={styles.button}
      />
      
      <Button
        title="Informação"
        onPress={() => showInfo('Nova atualização disponível!')}
        style={styles.button}
      />
      
      <Button
        title="Perigo (Danger)"
        onPress={() => showDanger('Ação perigosa detectada!')}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
