import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations } from "@/src/db";
import { clearDatabase } from "@/src/db/sqlite";
import { IUpdateRestaurantDTO } from "@/src/interfaces/dtos";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import { useAuthStore } from "@/src/store/authStore";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

const RestaurantForm = () => {
  const { user, updateUserRestaurant } = useAuthStore();
  const { showSuccess, showError, showInfo } = useToastAll();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
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
          number: user?.restaurant?.number,
          profileImage: user?.restaurant?.image,
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
          });
          return;
        }
      }
      reset({
        userId: user?.id,
        name: user?.restaurant?.name,
        cnpj: user?.restaurant?.cnpj,
        cep: user?.restaurant?.cep,
        number: user?.restaurant?.number,
        profileImage: user?.restaurant?.image,
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

        updateUserRestaurant(user?.restaurant?.id as number, data);
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
        updateUserRestaurant(user?.restaurant?.id, data);
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
    } catch (error) {
      showError("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="px-0">
      <CustomInput control={control} name="name" label="Nome" />
      <CustomInput
        control={control}
        name="cnpj"
        label="CNPJ"
        maxLength={14}
        keyboardType="numeric"
      />
      <CustomInput
        control={control}
        name="cep"
        label="CEP"
        maxLength={9}
        keyboardType="numeric"
      />
      <CustomInput
        control={control}
        name="number"
        label="Número"
        maxLength={5}
        keyboardType="numeric"
      />
      <CustomInput control={control} name="profileImage" label="Imagem" />

      <Button
        className="mt-6"
        text="Atualizar Dados"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!isDirty}
      />

      {__DEV__ && (
        <Button
          className="mt-4 bg-gray-100"
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
