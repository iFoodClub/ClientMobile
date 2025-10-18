import PressableButton from "@/components/Button/PressableButton";
import EmployeeCard from "@/components/EmployeeCard/EmployeeCard";
import EmployeeCardSkeleton from "@/components/EmployeeCard/EmployeeCardSkeleton";
import EmployeeForm from "@/components/Forms/EmployeeForm/EmployeeForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import { useToastAll } from "@/src/components/Toast";
import { useEmployees } from "@/src/hooks/useEmployees";
import { IEmployeeResponse } from "@/src/interfaces/apiResponses";
import { IEmployeeDTO } from "@/src/interfaces/dtos";
import { formMode, UserType } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmployeesScreen = () => {
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToastAll();
  const [mode, setMode] = useState<formMode>(formMode.create);
  const { employees, fetchEmployees, deleteEmployee, loading, createEmployee } =
    useEmployees(user?.company?.id);

  const [createEmployeeLoading, setCreateEmployeeLoading] =
    useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

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
    data = {
      ...data,
      userType: UserType.employee,
      company: { id: user.company.id },
    };

    console.log(JSON.stringify(data, null, 2));

    try {
      setCreateEmployeeLoading(true);
      await createEmployee(data);
      showSuccess(
        `Colaborador ${
          mode === formMode.create ? "criado" : "atualizado"
        } com sucesso!`
      );
      setEmployeeModalVisible(false);
    } catch (error) {
      showError(
        `Erro ao ${
          mode === formMode.create ? "criar" : "atualizar"
        } colaborador.`
      );
    } finally {
      setCreateEmployeeLoading(false);
    }
  }

  function handleEdit(employee: IEmployeeResponse) {
    console.log(JSON.stringify(employee, null, 2));
    setMode(formMode.update);
    reset({
      name: "employee.name",
      email: "eudevosermudado@gmail.com",
      password: "",
      password2: "",
      cpf: employee.cpf,
      profileImage: employee.profileImage,
      employee: { birthDate: employee.birthDate },
      // Certifique-se de incluir todos os campos do seu IEmployeeDTO
    });

    setEmployeeModalVisible(true);
    setSelectedEmployeeId(null);
  }

  async function handleDelete(employeeId: number) {
    console.log({ employeeId });
    try {
      await deleteEmployee(employeeId);
      showSuccess("Funcionário deletado com sucesso!");
      await fetchEmployees();
    } catch (error) {
      showError("Erro ao deletar funcionário.");
    } finally {
      setSelectedEmployeeId(null);
    }
  }

  return (
    <Pressable onPress={() => setSelectedEmployeeId(null)} className="flex-1">
      <SafeAreaView className="bg-white flex-1">
        <PageHeader
          title="Funcionários"
          subtitle="Gerencie seus colaboradores"
        />
        {loading && (
          <View className="mt-4 space-y-4 gap-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <EmployeeCardSkeleton key={index} />
            ))}
          </View>
        )}
        {!loading && (
          <FlatList
            className="px-4"
            data={employees}
            renderItem={({ item }) => (
              <EmployeeCard
                employee={item}
                isSelected={selectedEmployeeId === item.id}
                onLongPress={() => setSelectedEmployeeId(item.id)}
                onEdit={handleEdit}
                onDelete={() => handleDelete(item.id)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            ItemSeparatorComponent={() => <View className="h-4"></View>}
            contentContainerStyle={{ paddingVertical: 24 }}
            onScrollBeginDrag={() => setSelectedEmployeeId(null)}
          />
        )}

        <PressableButton
          className="absolute bottom-8 right-8"
          onPress={() => {
            setMode(formMode.create);
            reset({
              name: "",
              email: "",
              password: "",
              password2: "",
              cpf: "",
              profileImage: "",
              employee: { birthDate: "" },
            });
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
          <EmployeeForm mode={mode} control={control} />
        </ModalCustom>
      </SafeAreaView>
    </Pressable>
  );
};

export default EmployeesScreen;
