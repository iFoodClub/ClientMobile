import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations } from "@/src/db";
import { IUpdateRestaurantDTO } from "@/src/interfaces/dtos";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import { useAuthStore } from "@/src/store/authStore";
import { cepMask, cnpjMask } from "@/src/utils/masks";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
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
      
      console.log("JSON enviado para UPDATE RESTAURANT (restaurantId:", user?.restaurant?.id, "):", JSON.stringify(data, null, 2));
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
      <Controller
        control={control}
        name="cnpj"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View className="w-full">
              <Text className="text-sm font-semibold text-gray-600 mb-1">
                CNPJ
              </Text>
              <View
                className={`justify-center border flex flex-row items-center rounded-lg text-base p-1 pl-4 ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                }`}
              >
                <TextInput
                  keyboardType="numeric"
                  className={`text-base flex-1 ${
                    error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const maskedValue = cnpjMask(text);
                    onChange(maskedValue);
                  }}
                  value={value || ""}
                  placeholder="00.000.000/0000-00"
                  placeholderTextColor={"#9CA3AF"}
                  maxLength={18}
                />
              </View>
              <View className="h-[20px] flex items-end">
                {error && (
                  <Text className="text-red-500 text-sm">{error.message}</Text>
                )}
              </View>
            </View>
          </>
        )}
      />
      <Controller
        control={control}
        name="cep"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View className="w-full">
              <Text className="text-sm font-semibold text-gray-600 mb-1">
                CEP
              </Text>
              <View
                className={`justify-center border flex flex-row items-center rounded-lg text-base p-1 pl-4 ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                }`}
              >
                <TextInput
                  keyboardType="numeric"
                  className={`text-base flex-1 ${
                    error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const maskedValue = cepMask(text);
                    onChange(maskedValue);
                  }}
                  value={value || ""}
                  placeholder="12345-678"
                  placeholderTextColor={"#9CA3AF"}
                  maxLength={9}
                />
              </View>
              <View className="h-[20px] flex items-end">
                {error && (
                  <Text className="text-red-500 text-sm">{error.message}</Text>
                )}
              </View>
            </View>
          </>
        )}
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
      {/*__DEV__ && (
        <Button
          className="flex flex-row mt-2 bg-red-500"
          text="Limpar Banco (Debug)"
          onPress={() => {
            clearDatabase();
            runMigrations();
            showInfo("Banco limpo e migrações executadas");
          }}
        />
      )}*/}
    </SafeAreaView>
  );
};

export default RestaurantForm;
