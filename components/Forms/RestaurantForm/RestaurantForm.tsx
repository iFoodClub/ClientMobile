import { ICreateAccountForm } from "@/src/interfaces/interfaces";
import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { AccountInfo } from "./components/step2/AccountInfo";
import RestaurantInfoForm from "./components/step3/RestaurantInfoForm";
import AddressForm from "./components/step4/AddressForm";
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
  const restaurantStepsInfo = [
    {
      title: "Dados da conta",
      component: <AccountInfo control={control} />,
    },
    {
      title: "Dados do restaurante",
      component: <RestaurantInfoForm control={control} />,
    },
    {
      title: "Endereço",
      component: <AddressForm control={control} />,
    },
  ];

  return (
    <View>
      <View className="flex flex-row justify-between items-baseline">
        <Text className="text-2xl mb-10">
          {restaurantStepsInfo[step - 2].title}
        </Text>
        <TouchableOpacity onPress={() => setStep((prev) => prev - 1)}>
          <Text className="text-primary">Voltar</Text>
        </TouchableOpacity>
      </View>
      {restaurantStepsInfo[step - 2].component}
    </View>
  );
};

export default RestaurantForm;
