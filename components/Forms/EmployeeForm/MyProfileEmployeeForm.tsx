import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations } from "@/src/db";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import EmployeeRepository from "@/src/repository/employeeRepository";
import { useAuthStore } from "@/src/store/authStore";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, Text, Switch } from "react-native";
import { COLORS } from "@/src/constants/colors";

interface IUpdateEmployeeDTO {
  userId?: number;
  companyId?: number;
  name: string;
  cpf: string;
  birthDate: string;
  vacation: boolean;
  profileImage?: string;
}

const MyProfileEmployeeForm = () => {
  const { user, updateUserEmployee } = useAuthStore();
  const { showSuccess, showError, showInfo } = useToastAll();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IUpdateEmployeeDTO>({
    mode: "onBlur",
  });

  useEffect(() => {
    async function hydrate() {
      await runMigrations();

      const state = await NetInfo.fetch();
      if (state.isConnected) {
        reset({
          userId: user?.id,
          companyId: user?.employee?.companyId,
          name: user?.employee?.name || user?.name,
          cpf: user?.employee?.cpf,
          birthDate: user?.employee?.birthDate,
          vacation: user?.employee?.vacation || false,
          profileImage: user?.profileImage,
        });
        return;
      }

      if (user?.id) {
        const local = LocalProfileRepository.getProfile(String(user.id));
        if (local) {
          const data: any = local.data || {};
          reset({
            userId: Number(local.userId),
            companyId: data.companyId ?? user?.employee?.companyId,
            name: data.name ?? local.name ?? user?.employee?.name ?? user?.name,
            cpf: data.cpf ?? user?.employee?.cpf,
            birthDate: data.birthDate ?? user?.employee?.birthDate,
            vacation: data.vacation ?? user?.employee?.vacation ?? false,
            profileImage: data.profileImage ?? local.photo ?? user?.profileImage,
          });
          return;
        }
      }

      reset({
        userId: user?.id,
        companyId: user?.employee?.companyId,
        name: user?.employee?.name || user?.name,
        cpf: user?.employee?.cpf,
        birthDate: user?.employee?.birthDate,
        vacation: user?.employee?.vacation || false,
        profileImage: user?.profileImage,
      });
    }
    hydrate();
  }, [user, reset]);

  async function onSubmit(data: IUpdateEmployeeDTO) {
    try {
      setLoading(true);
      await runMigrations();

      if (!user?.id) {
        showError("Usuário não encontrado.");
        return;
      }

      const userId = String(user.id);
      const net = await NetInfo.fetch();

      if (!net.isConnected) {
        LocalProfileRepository.upsertProfile({
          userId,
          name: data.name,
          email: user?.email,
          photo: data.profileImage,
          data,
          dirty: 1,
        });

        updateUserEmployee(data);
        showSuccess("Alterações salvas offline.");
        return;
      }

      if (!user?.employee?.id) {
        showError("Funcionário não encontrado.");
        return;
      }

      const response = await EmployeeRepository.updateEmployee(
        user.employee.id,
        data as any
      );

      if (response.status === 200) {
        updateUserEmployee(data);
        LocalProfileRepository.upsertProfile({
          userId,
          name: data.name,
          email: user?.email,
          photo: data.profileImage,
          data,
          dirty: 0,
        });
        showSuccess("Perfil atualizado com sucesso!");
      }
    } catch (_error) {
      showError("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="px-0 pb-10">
      {/* Seção: Informações Básicas */}
      <View className="mb-6">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Dados Pessoais</Text>
        <CustomInput
          control={control}
          name="name"
          label="Nome Completo"
          placeholder="Ex: João da Silva"
        />
        <CustomInput
          control={control}
          name="birthDate"
          label="Data de Nascimento"
          placeholder="Ex: 1995-10-15"
          maxLength={10}
        />
      </View>

      {/* Seção: Status e Férias */}
      <View className="mb-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-gray-900 font-bold text-base">Em Férias</Text>
          <Text className="text-gray-500 text-xs mt-0.5">
            Ao ativar, seus agendamentos semanais de almoço serão pausados automaticamente.
          </Text>
        </View>
        <Controller
          control={control}
          name="vacation"
          render={({ field: { value, onChange } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: "#D1D5DB", true: COLORS.primary + "30" }}
              thumbColor={value ? COLORS.primary : "#F3F4F6"}
            />
          )}
        />
      </View>

      {/* Seção: Dados Cadastrais */}
      <View className="mb-8 opacity-70">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Documentos</Text>
        <CustomInput
          control={control}
          name="cpf"
          label="CPF"
          placeholder="000.000.000-00"
          editable={false}
        />
        <Text className="text-gray-400 text-[10px] ml-1 -mt-2">
          Para alterar o CPF, entre em contato com o RH da sua empresa.
        </Text>
      </View>

      <Button
        className="mt-4"
        text="Salvar Alterações"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
      />
    </View>
  );
};

export default MyProfileEmployeeForm;
