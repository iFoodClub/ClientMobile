import CustomInput from "@/components/CustomInput/CustomInput";
import TimePickerInput from "@/components/TimePickerInput/TimePickerInput";
import { formIconSize } from "@/src/constants/constants";
import { IBusiness, UserType } from "@/src/interfaces/interfaces";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { View, Text } from "react-native";

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
  const watchedOpeningTime = useWatch({ control, name: "restaurant.openingTime" });

  useEffect(() => {
    setValue("name", watchedRestaurantName);
  }, [watchedRestaurantName, setValue]);

  return (
    <View>
      <CustomInput
        icon={
          watchedUserType === "company" ? (
            <Ionicons
              name="business-outline"
              size={formIconSize}
              color="black"
            />
          ) : (
            <Ionicons
              name="restaurant-outline"
              size={formIconSize}
              color="black"
            />
          )
        }
        name={
          watchedUserType === "company" ? "company.name" : "restaurant.name"
        }
        label={
          watchedUserType === "company"
            ? "Nome da Empresa"
            : "Nome do Restaurante"
        }
        placeholder={
          watchedUserType === "company"
            ? "Digite o nome da empresa "
            : " Digite o nome do restaurante"
        }
        control={control}
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
      <CustomInput
        icon={
          <Ionicons
            name="document-text-outline"
            size={formIconSize}
            color="black"
          />
        }
        name="cnpj"
        label="CNPJ"
        placeholder="Digite o CNPJ"
        control={control}
        maxLength={14}
        rules={{ required: { value: true, message: "O CNPJ é obrigatório" } }}
        keyboardType="numeric"
      />
      <CustomInput
        name="profileImage"
        icon={
          <Ionicons name="image-outline" size={formIconSize} color="black" />
        }
        placeholder="Digite o link da imagem"
        label="Imagem do Perfil"
        control={control}
        rules={{ required: { value: true, message: "A imagem é obrigatória" } }}
      />

      {watchedUserType === UserType.restaurant && (
        <View className="mt-4">
          <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Funcionamento</Text>
          <View className="flex-row gap-x-4">
            <View className="flex-1">
              <TimePickerInput
                control={control}
                name="restaurant.openingTime"
                label="Abre às"
              />
            </View>
            <View className="flex-1">
              <TimePickerInput
                control={control}
                name="restaurant.closingTime"
                label="Fecha às"
                rules={{ 
                  validate: (value) => {
                    const opening = String(watchedOpeningTime || "");
                    if (!opening || !value) return true;

                    const [hStart, mStart] = opening.split(":").map(Number);
                    const [hEnd, mEnd] = String(value).split(":").map(Number);

                    const startInMinutes = hStart * 60 + mStart;
                    const endInMinutes = hEnd * 60 + mEnd;

                    if (endInMinutes <= startInMinutes) {
                      return "Deve ser após a abertura.";
                    }

                    if (endInMinutes - startInMinutes < 120) {
                      return "Mínimo 2h de funcionamento.";
                    }

                    return true;
                  }
                }}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default BusinessInfo;
