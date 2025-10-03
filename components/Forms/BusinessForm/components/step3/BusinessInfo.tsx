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
        name={
          watchedUserType === "company" ? "company.name" : "restaurant.name"
        }
        label={
          watchedUserType === "company"
            ? "Nome da Empresa"
            : "Nome do Restaurante"
        }
        placeholder={"Digite o nome da empresa "}
        control={control}
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
      <CustomInput
        name="cnpj"
        label="CNPJ"
        placeholder="Digite o CNPJ"
        control={control}
        maxLength={14}
        rules={{ required: { value: true, message: "O CNPJ é obrigatório" } }}
      />
      <CustomInput
        name="profileImage"
        placeholder="Digite o link da imagem"
        label="Imagem do Perfil"
        control={control}
        rules={{ required: { value: true, message: "A imagem é obrigatória" } }}
      />
    </View>
  );
};

export default BusinessInfo;
