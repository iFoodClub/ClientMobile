import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { useToastAll } from "@/src/components/Toast";
import { IUpdateRestaurantDTO } from "@/src/interfaces/dtos";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import { useAuthStore } from "@/src/store/authStore";
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
    reset({
      userId: user?.id,
      name: user?.restaurant?.name,
      cnpj: user?.restaurant?.cnpj,
      cep: user?.restaurant?.cep,
      number: user?.restaurant?.number,
      profileImage: user?.restaurant?.image,
    });
  }, [user, reset]);

  async function onSubmit(data: IUpdateRestaurantDTO) {
    try {
      if (!isDirty) {
        showInfo("Sem dados para atualizar.");
        return;
      }
      setLoading(true);
      if (!user?.restaurant?.id) return;
      const response = await RestaurantRepository.updateRestaurant(
        user?.restaurant?.id,
        data
      );

      if (response.status === 200) {
        updateUserRestaurant(user?.restaurant?.id, data);
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
    </SafeAreaView>
  );
};

export default RestaurantForm;
