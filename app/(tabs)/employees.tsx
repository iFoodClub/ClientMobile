import PressableButton from "@/components/Button/PressableButton";
import EmployeeCard from "@/components/EmployeeCard/EmployeeCard";
import EmployeeCardSkeleton from "@/components/EmployeeCard/EmployeeCardSkeleton";
import EmployeeForm from "@/components/Forms/EmployeeForm/EmployeeForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import { useToastAll } from "@/src/components/Toast";
import { useEmployees } from "@/src/hooks/useEmployees";
import { IEmployeeSimple } from "@/src/interfaces/apiResponses";
import { IEmployeeDTO } from "@/src/interfaces/dtos";
import { formMode, UserType } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UploadRepository from "@/src/repository/uploadRepository";

const EmployeesScreen = () => {
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToastAll();
  const [mode, setMode] = useState<formMode>(formMode.create);
  const {
    employees,
    updateEmployee,
    fetchEmployees,
    deleteEmployee,
    loading,
    createEmployee,
  } = useEmployees(user?.company?.id);

  const [createEmployeeLoading, setCreateEmployeeLoading] =
    useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<IEmployeeSimple | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<IEmployeeDTO>({
    mode: "onBlur",
  });

  async function handleSubmitForm(data: IEmployeeDTO) {
    if (!user?.company?.id) return;

    try {
      setCreateEmployeeLoading(true);

      // Se a imagem for um caminho local, realiza o upload primeiro
      let finalProfileImageUrl = data.profileImage;
      if (data.profileImage && !data.profileImage.startsWith("http")) {
        const uploadRes = await UploadRepository.uploadImage(data.profileImage, "perfis");
        if (uploadRes.data?.success && uploadRes.data?.data?.url) {
          finalProfileImageUrl = uploadRes.data.data.url;
        } else {
          throw new Error("Falha ao subir foto de perfil");
        }
      }

      const submissionData: IEmployeeDTO = {
        ...data,
        profileImage: finalProfileImageUrl,
        userType: UserType.employee,
        company: { id: user.company.id },
      };

      if (mode === formMode.create) {
        await createEmployee(submissionData);
      } else {
        if (!selectedEmployeeId) return;
        const updateEmployeeData: Partial<IEmployeeSimple> = {
          name: submissionData.name,
          profileImage: submissionData.profileImage,
          birthDate: submissionData.employee.birthDate,
          cpf: submissionData.cpf,
          companyId: user.company.id,
          userId: selectedEmployee?.userId,
          vacation: false,
        };
        await updateEmployee(selectedEmployeeId, updateEmployeeData);
      }
      showSuccess(
        `Colaborador ${mode === formMode.create ? "criado" : "atualizado"
        } com sucesso!`
      );
      fetchEmployees();
      setEmployeeModalVisible(false);
    } catch (_error) {
      console.error("[EmployeesScreen] Erro ao submeter:", _error);
      showError(
        `Erro ao ${mode === formMode.create ? "criar" : "atualizar"
        } colaborador.`
      );
    } finally {
      setCreateEmployeeLoading(false);
    }
  }

  function handleEdit(employee: IEmployeeSimple) {
    setMode(formMode.update);
    reset({
      name: employee.name,
      email: employee.email,
      password: "",
      password2: "",
      cpf: employee.cpf,
      profileImage: employee.profileImage,
      employee: { birthDate: employee.birthDate },
    });

    setEmployeeModalVisible(true);
    setSelectedEmployeeId(employee.id);
    setSelectedEmployee(employee);
  }

  async function handleDelete(employeeId: number) {
    try {
      await deleteEmployee(employeeId);
      showSuccess("Funcionário deletado com sucesso!");
      await fetchEmployees();
    } catch (_error) {
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
        {employees && employees.length > 0 && (
          <View className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex-row items-center">
            <Text className="text-gray-400 text-xs italic">
              💡 Dica: Toque e segure em um colaborador para ver as opções (Editar/Excluir).
            </Text>
          </View>
        )}
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
          className="absolute bottom-20 right-7"
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
          onClose={() => {
            setEmployeeModalVisible(false);
            setSelectedEmployeeId(null);
          }}
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
