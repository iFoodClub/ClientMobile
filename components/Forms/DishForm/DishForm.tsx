import CustomInput from "@/components/CustomInput/CustomInput";
import { ICreateDishDTO } from "@/src/interfaces/interfaces";
import React from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";

type DishFormProps = {
  control: Control<ICreateDishDTO, any, ICreateDishDTO>;
};

const DishForm = ({ control }: DishFormProps) => {
  return (
    <View>
      <CustomInput
        control={control}
        name="image"
        label="Imagem"
        rules={{
          required: { value: true, message: "A imagem é obrigatória" },
        }}
      />
      <CustomInput
        control={control}
        name="name"
        label="Nome"
        maxLength={80}
        rules={{
          required: { value: true, message: "O nome é obrigatório" },
        }}
      />
      <CustomInput
        control={control}
        name="description"
        label="Descrição"
        maxLength={255}
        rules={{
          required: {
            value: true,
            message: "A descrição é obrigatória",
          },
        }}
      />
      <CustomInput
        control={control}
        name="price"
        label="Preço"
        keyboardType="numeric"
        rules={{
          required: { value: true, message: "O preço é obrigatório" },
        }}
      />
    </View>
  );
};

export default DishForm;
