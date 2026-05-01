import { IBusiness, UserType } from "@/src/interfaces/interfaces";
import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { AccountInfo } from "./components/step2/AccountInfo";
import BusinessInfo from "./components/step3/BusinessInfo";
import AddressForm from "./components/step4/AddressForm";

type BusinessFormProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  setValue: UseFormSetValue<IBusiness>;
  control: Control<any>;
  watchedUserType: UserType;
};

const BusinessForm = ({
  setStep,
  step,
  setValue,
  control,
  watchedUserType,
}: BusinessFormProps) => {
  const restaurantStepsInfo = [
    {
      title: "Dados da conta",
      component: (
        <AccountInfo control={control} watchedUserType={watchedUserType} />
      ),
    },
    {
      title: "Dados do estabelecimento",
      component: (
        <BusinessInfo
          control={control}
          setValue={setValue}
          watchedUserType={watchedUserType}
        />
      ),
    },
    {
      title: "Informações de endereço",
      component: (
        <AddressForm
          control={control}
          setValue={setValue}
          watchedUserType={watchedUserType}
        />
      ),
    },
  ];

  return (
    <View className="px-4">
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

export default BusinessForm;
