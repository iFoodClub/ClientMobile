import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import TimePickerInput from "@/components/TimePickerInput/TimePickerInput";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations, clearDatabase } from "@/src/db";
import { IUpdateRestaurantDTO } from "@/src/interfaces/dtos";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import { useAuthStore } from "@/src/store/authStore";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Text } from "react-native";

const RestaurantForm = () => {
  const { user, updateUserRestaurant } = useAuthStore();
  const { showSuccess, showError, showInfo } = useToastAll();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<IUpdateRestaurantDTO>({
    mode: "onBlur",
  });

  useEffect(() => {
    async function hydrate() {
      await runMigrations();

      const state = await NetInfo.fetch();
      if (state.isConnected) {
        reset({
          userId: user?.id,
          name: user?.restaurant?.name,
          cnpj: user?.restaurant?.cnpj,
          cep: user?.restaurant?.cep,
          rua: user?.restaurant?.rua,
          number: user?.restaurant?.number,
          profileImage: user?.restaurant?.image,
          openingTime: user?.restaurant?.openingTime,
          closingTime: user?.restaurant?.closingTime,
        });
        return;
      }
      if (user?.id) {
        const local = LocalProfileRepository.getProfile(String(user.id));
        if (local) {
          const data: any = local.data || {};
          reset({
            userId: Number(local.userId),
            name: data.name ?? local.name ?? user?.restaurant?.name,
            cnpj: data.cnpj ?? user?.restaurant?.cnpj,
            cep: data.cep ?? user?.restaurant?.cep,
            number: data.number ?? user?.restaurant?.number,
            profileImage:
              data.profileImage ?? local.photo ?? user?.restaurant?.image,
            rua: data.rua ?? user?.restaurant?.rua,
            openingTime: data.openingTime ?? user?.restaurant?.openingTime,
            closingTime: data.closingTime ?? user?.restaurant?.closingTime,
          });
          return;
        }
      }
      reset({
        userId: user?.id,
        name: user?.restaurant?.name,
        cnpj: user?.restaurant?.cnpj,
        cep: user?.restaurant?.cep,
        rua: user?.restaurant?.rua,
        number: user?.restaurant?.number,
        profileImage: user?.restaurant?.image,
        openingTime: user?.restaurant?.openingTime,
        closingTime: user?.restaurant?.closingTime,
      });
    }
    hydrate();
  }, [user, reset]);

  async function onSubmit(data: IUpdateRestaurantDTO) {
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

        updateUserRestaurant(data);
        showSuccess("Alterações salvas offline.");
        return;
      }

      if (!user?.restaurant?.id) {
        showError("Restaurante não encontrado.");
        return;
      }

      const response = await RestaurantRepository.updateRestaurant(
        user?.restaurant?.id,
        data
      );

      if (response.status === 200) {
        updateUserRestaurant(data);
        LocalProfileRepository.upsertProfile({
          userId,
          name: data.name,
          email: user?.email,
          photo: data.profileImage,
          data,
          dirty: 0,
        });
        showSuccess("Restaurante atualizado!");
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
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Informações do Restaurante</Text>
        <CustomInput 
          control={control} 
          name="name" 
          label="Nome Fantasia" 
          placeholder="Ex: Sabores do Chef" 
        />
      </View>

      {/* Seção: Operação */}
      <View className="mb-6">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Funcionamento</Text>
        <View className="flex-row gap-x-4">
          <View className="flex-1">
            <TimePickerInput
              control={control}
              name="openingTime"
              label="Abre às"
            />
          </View>
          <View className="flex-1">
            <TimePickerInput
              control={control}
              name="closingTime"
              label="Fecha às"
              rules={{
                validate: (value) => {
                  const opening = watch("openingTime");
                  if (!opening || !value) return true;

                  const [hStart, mStart] = opening.split(":").map(Number);
                  const [hEnd, mEnd] = value.split(":").map(Number);

                  const startInMinutes = hStart * 60 + mStart;
                  const endInMinutes = hEnd * 60 + mEnd;

                  if (endInMinutes <= startInMinutes) {
                    return "Deve ser após a abertura.";
                  }

                  if (endInMinutes - startInMinutes < 120) {
                    return "Mínimo 2h de funcionamento.";
                  }

                  return true;
                },
              }}
            />
          </View>
        </View>
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
          name="rua" 
          label="Rua / Logradouro" 
          placeholder="Nome da rua"
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
        className="mt-8"
        text="Salvar Alterações"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!isDirty}
      />

      {__DEV__ && (
        <Button
          type="secondary"
          className="mt-3"
          text="Limpar Banco (Debug)"
          onPress={() => {
            clearDatabase();
            runMigrations();
            showInfo("Banco limpo");
          }}
        />
      )}
    </View>
  );
};

export default RestaurantForm;
