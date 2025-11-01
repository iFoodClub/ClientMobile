import CustomInput from "@/components/CustomInput/CustomInput";
import { ICreateDishDTO } from "@/src/interfaces/interfaces";
import { currencyMask, currencyToNumber, numberToCurrency } from "@/src/utils/masks";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

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
      <Controller
        control={control}
        name="price"
        rules={{
          required: { value: true, message: "O preço é obrigatório" },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View className="w-full">
              <Text className="text-sm font-semibold text-gray-600 mb-1">
                Preço
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
                    const maskedValue = currencyMask(text);
                    const numericValue = currencyToNumber(maskedValue);
                    onChange(numericValue);
                  }}
                  value={
                    value !== undefined && value !== null
                      ? numberToCurrency(value)
                      : ""
                  }
                  placeholderTextColor={"#9CA3AF"}
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
    </View>
  );
};

export default DishForm;
