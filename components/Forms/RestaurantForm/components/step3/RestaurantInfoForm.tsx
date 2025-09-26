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
      />
      <CustomInput name="cnpj" label="CNPJ do Restaurante" control={control} />
      <CustomInput
        name="profileImage"
        label="Imagem do Restaurante"
        control={control}
      />
    </View>
  );
};

export default RestaurantInfoForm;
