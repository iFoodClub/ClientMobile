import CustomInput from "@/components/CustomInput/CustomInput";
import { ICreateAccountForm } from "@/src/interfaces/interfaces";
import React from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";

type RestaurantInfoFormProps = {
  control: Control<ICreateAccountForm>;
};

const RestaurantInfoForm = ({ control }: RestaurantInfoFormProps) => {
  return (
    <View>
      <CustomInput
        name="restaurant.name"
        label="Nome do restaurante"
        control={control}
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
      <CustomInput
        name="cnpj"
        label="CNPJ do Restaurante"
        control={control}
        rules={{ required: { value: true, message: "O CNPJ é obrigatório" } }}
      />
      <CustomInput
        name="profileImage"
        label="Imagem do Restaurante"
        control={control}
        rules={{ required: { value: true, message: "A imagem é obrigatória" } }}
      />
    </View>
  );
};

export default RestaurantInfoForm;
