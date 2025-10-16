import PressableButton from "@/components/Button/PressableButton";
import EmployeeForm from "@/components/Forms/EmployeeForm/EmployeeForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import { useToastAll } from "@/src/components/Toast";
import { useEmployees } from "@/src/hooks/useEmployees";
import { IEmployeeDTO } from "@/src/interfaces/dtos";
import { formMode } from "@/src/interfaces/interfaces";
import EmployeeRepository from "@/src/repository/employeeRepository";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

const employees = () => {
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToastAll();
  const { employees, fetchEmployees } = useEmployees(user?.company?.id);
  const [createEmployeeLoading, setCreateEmployeeLoading] =
    useState<boolean>(false);
  const [mode, setMode] = useState<formMode>(formMode.create);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IEmployeeDTO>({
    mode: "onBlur",
  });

  async function handleSubmitForm(data: IEmployeeDTO) {
    if (!user?.company?.id) return;
    data = { ...data, company: { id: user?.company?.id } };

    try {
      setCreateEmployeeLoading(true);
      const response = await EmployeeRepository.createEmployee(data);
      console.log(JSON.stringify(response.data, null, 2));
      showSuccess("Colaborador criado com sucesso!");
      setEmployeeModalVisible(false);
      await fetchEmployees();
    } catch (error) {
      showError("Erro ao criar colaborador.");
    } finally {
      setCreateEmployeeLoading(false);
    }
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <PageHeader title="Funcionários" subtitle="Gerencie seus colaboradores" />

      {/* <FlatList
        data={employees}
        renderItem={() => <></>}
        numColumns={1}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        contentContainerStyle={{ paddingVertical: 24 }}
      /> */}

      <PressableButton
        className="absolute bottom-8 right-8"
        onPress={() => {
          setMode(formMode.create);
          setEmployeeModalVisible(true);
        }}
        icon={<AntDesign name="plus" size={16} color="white" />}
      />

      <ModalCustom
        visible={employeeModalVisible}
        loading={createEmployeeLoading}
        onClose={() => setEmployeeModalVisible(false)}
        title={
          mode === formMode.create ? "Novo colaborador" : "Editar colaborador"
        }
        onConfirm={handleSubmit(handleSubmitForm)}
        confirmText={mode === formMode.create ? "Criar" : "Salvar"}
      >
        <EmployeeForm control={control} />
      </ModalCustom>
    </SafeAreaView>
  );
};

export default employees;
