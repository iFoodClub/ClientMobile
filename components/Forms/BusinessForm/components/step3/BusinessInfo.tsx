import CustomInput from "@/components/CustomInput/CustomInput";
import { IBusiness, UserType } from "@/src/interfaces/interfaces";
import React, { useEffect } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { View } from "react-native";

type BusinessInfoProps = {
  control: Control<IBusiness>;
  setValue: UseFormSetValue<IBusiness>;
  watchedUserType: UserType;
};

const BusinessInfo = ({
  control,
  setValue,
  watchedUserType,
}: BusinessInfoProps) => {
  const watchedRestaurantName = useWatch({ control, name: "restaurant.name" });

  useEffect(() => {
    setValue("name", watchedRestaurantName);
  }, [watchedRestaurantName]);

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
        maxLength={14}
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

export default BusinessInfo;
