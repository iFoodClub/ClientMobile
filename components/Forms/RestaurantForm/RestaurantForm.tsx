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
import { SafeAreaView } from "react-native-safe-area-context";

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
      // Garantir que as migrações sejam executadas
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
            profileImage: data.profileImage ?? local.photo ?? user?.restaurant?.image,
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
      
      // Garantir que as migrações sejam executadas antes de salvar
      await runMigrations();
      
      // Validação mais robusta do user.id
      if (!user?.id || user.id === null || user.id === undefined) {
        showError("Usuário não encontrado. Faça login novamente.");
        return;
      }
      
      const userId = String(user.id);
      console.log('RestaurantForm.onSubmit - userId:', userId, 'tipo:', typeof userId);
      
      const net = await NetInfo.fetch();
      
      if (!net.isConnected) {
        // Debug: verificar estado da tabela antes
        console.log('RestaurantForm - Estado da tabela ANTES da inserção:');
        LocalProfileRepository.debugTable();
        
        // salva localmente como sujo para sincronizar depois
        LocalProfileRepository.upsertProfile({
          userId,
          name: data.name,
          email: user?.email,
          photo: data.profileImage,
          data,
          dirty: 1,
        });
        
        // Debug: verificar estado da tabela depois
        console.log('RestaurantForm - Estado da tabela DEPOIS da inserção:');
        LocalProfileRepository.debugTable();
        
        updateUserRestaurant(user?.restaurant?.id as number, data);
        showSuccess("Alterações salvas offline. Será sincronizado quando online.");
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
        // atualiza cache local como limpo
        LocalProfileRepository.upsertProfile({
          userId,
          name: data.name,
          email: user?.email,
          photo: data.profileImage,
          data,
          dirty: 0,
        });
        showSuccess("Restaurante atualizado com sucesso!");
      }
    } catch (error) {
      console.error(error);
      showError("Erro ao atualizar restaurante.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="px-4">
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
        label="Número"
        maxLength={5}
        keyboardType="numeric"
      />
      <CustomInput control={control} name="profileImage" label="Imagem" />

      <Button
        className="flex flex-row"
        text="Atualizar"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={isDirty ? false : true}
      />
      
      {/* Botão temporário para debug - remover depois */}
      {__DEV__ && (
        <Button
          className="flex flex-row mt-2 bg-red-500"
          text="Limpar Banco (Debug)"
          onPress={() => {
            clearDatabase();
            runMigrations();
            showInfo("Banco limpo e migrações executadas");
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default RestaurantForm;
