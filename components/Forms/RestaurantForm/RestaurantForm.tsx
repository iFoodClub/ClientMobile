import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { IUpdateRestaurantDTO } from "@/src/interfaces/dtos";
import { useAuthStore } from "@/src/store/authStore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

const RestaurantForm = () => {
  const { user } = useAuthStore();
  const { control, handleSubmit, reset } = useForm<IUpdateRestaurantDTO>({
    mode: "onBlur",
    defaultValues: {
      name: user?.name,
      cnpj: user?.restaurant?.cnpj,
      cep: user?.restaurant?.cep,
      number: user?.restaurant?.number,
      profileImage: user?.restaurant?.image,
    },
  });

  const [initialValues, safetInitialValues] = useState({
    name: user?.name,
    cnpj: user?.restaurant?.cnpj,
    cep: user?.restaurant?.cep,
    number: user?.restaurant?.number,
    profileImage: user?.restaurant?.image,
  });

  return (
    <View className="px-8">
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

      <Button text="Salvar" onPress={() => {}} />
    </View>
  );
};

export default RestaurantForm;
