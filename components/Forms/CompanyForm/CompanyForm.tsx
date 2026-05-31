import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations } from "@/src/db";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import CompanyRepository from "@/src/repository/companyRepository";
import { useAuthStore } from "@/src/store/authStore";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Text } from "react-native";

interface IUpdateCompanyDTO {
  userId?: number;
  name: string;
  cnpj: string;
  cep: string;
  number: string;
  profileImage?: string;
  restaurantId?: number;
}

const CompanyForm = () => {
  const { user, updateUserCompany } = useAuthStore();
  const { showSuccess, showError, showInfo } = useToastAll();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IUpdateCompanyDTO>({
    mode: "onBlur",
  });

  useEffect(() => {
    async function hydrate() {
      await runMigrations();

      const state = await NetInfo.fetch();
      if (state.isConnected) {
        reset({
          userId: user?.id,
          name: user?.company?.name,
          cnpj: user?.company?.cnpj,
          cep: user?.company?.cep,
          number: user?.company?.number,
          profileImage: user?.profileImage,
          restaurantId: user?.company?.restaurantId,
        });
        return;
      }

      if (user?.id) {
        const local = LocalProfileRepository.getProfile(String(user.id));
        if (local) {
          const data: any = local.data || {};
          reset({
            userId: Number(local.userId),
            name: data.name ?? local.name ?? user?.company?.name,
            cnpj: data.cnpj ?? user?.company?.cnpj,
            cep: data.cep ?? user?.company?.cep,
            number: data.number ?? user?.company?.number,
            profileImage: data.profileImage ?? local.photo ?? user?.profileImage,
            restaurantId: data.restaurantId ?? user?.company?.restaurantId,
          });
          return;
        }
      }

      reset({
        userId: user?.id,
        name: user?.company?.name,
        cnpj: user?.company?.cnpj,
        cep: user?.company?.cep,
        number: user?.company?.number,
        profileImage: user?.profileImage,
        restaurantId: user?.company?.restaurantId,
      });
    }
    hydrate();
  }, [user, reset]);

  async function onSubmit(data: IUpdateCompanyDTO) {
    try {
      if (!isDirty) {
        showInfo("Sem dados para atualizar.");
        return;
      }
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

        updateUserCompany(data);
        showSuccess("Alterações salvas offline.");
        return;
      }

      if (!user?.company?.id) {
        showError("Empresa não encontrada.");
        return;
      }

      const response = await CompanyRepository.updateCompany(
        user.company.id,
        data
      );

      if (response.status === 200) {
        updateUserCompany(data);
        LocalProfileRepository.upsertProfile({
          userId,
          name: data.name,
          email: user?.email,
          photo: data.profileImage,
          data,
          dirty: 0,
        });
        showSuccess("Empresa atualizada com sucesso!");
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
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Informações da Empresa</Text>
        <CustomInput
          control={control}
          name="name"
          label="Nome Fantasia"
          placeholder="Ex: Minha Empresa LTDA"
        />
      </View>

      {/* Seção: Endereço */}
      <View className="mb-6">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Localização</Text>
        <CustomInput
          control={control}
          name="cep"
          label="CEP"
          placeholder="00000-000"
          maxLength={9}
          keyboardType="numeric"
        />
        <CustomInput
          control={control}
          name="number"
          label="Número"
          placeholder="123"
          maxLength={10}
          keyboardType="numeric"
        />
      </View>

      {/* Seção: Dados Jurídicos */}
      <View className="mb-8 opacity-70">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Dados Cadastrais</Text>
        <CustomInput
          control={control}
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0001-00"
          editable={false}
        />
        <Text className="text-gray-400 text-[10px] ml-1 -mt-2">
          Para alterar o CNPJ, entre em contato com o suporte.
        </Text>
      </View>

      <Button
        className="mt-4"
        text="Salvar Alterações"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!isDirty}
      />
    </View>
  );
};

export default CompanyForm;
