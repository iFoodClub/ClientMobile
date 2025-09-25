import { ICreateAccountForm } from "@/src/interfaces/interfaces";
import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { AccountInfo } from "./components/step2/AccountInfo";
type AccountInfoProps = {
  control: Control<ICreateAccountForm>;
};

type RestaurantFormProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  setValue: UseFormSetValue<ICreateAccountForm>;
  control: Control<any>;
};

const RestaurantForm = ({
  setStep,
  step,
  setValue,
  control,
}: RestaurantFormProps) => {
  return (
    <View>
      <View className="flex flex-row justify-between items-baseline">
        <Text className="text-2xl mb-10">Dados da conta </Text>
        <TouchableOpacity onPress={() => setStep((prev) => prev - 1)}>
          <Text className="text-primary">Voltar</Text>
        </TouchableOpacity>
      </View>
      {step === 2 && <AccountInfo control={control} />}
    </View>
  );
};

export default RestaurantForm;
