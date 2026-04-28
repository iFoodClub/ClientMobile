import CustomInput from "@/components/CustomInput/CustomInput";
import { formIconSize } from "@/src/constants/constants";
import { IBusiness, UserType } from "@/src/interfaces/interfaces";
import { isValidCep } from "@/src/utils/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { Alert, TextInputChangeEvent, View } from "react-native";

type AddressFormProps = {
  control: Control<any>;
  setValue: UseFormSetValue<IBusiness>;
  watchedUserType: UserType;
};

const AddressForm = ({
  control,
  setValue,
  watchedUserType,
}: AddressFormProps) => {
  async function handleCEP(e: TextInputChangeEvent) {
    let cep = e.nativeEvent.text;
    if (e.nativeEvent.text.length === 9) {
      cep = e.nativeEvent.text.replace("-", "");
    }

    if (isValidCep(cep) && watchedUserType === UserType.restaurant) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        setValue("restaurant.cep", cep);
        setValue("restaurant.rua", data.logradouro);
        setValue("restaurant.cidade", data.localidade);
        setValue("restaurant.estado", data.uf);
        setValue("restaurant.complemento", data.complemento);
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        Alert.alert("Erro", "Erro ao buscar CEP.");
      }
    } else {
      setValue("company.cep", cep);
      setValue("company.restaurantId", 1);
    }
  }

  return (
    <View>
      <CustomInput
        name={watchedUserType === "company" ? "company.cep" : "restaurant.cep"}
        label="CEP"
        control={control}
        keyboardType="numeric"
        onChange={handleCEP}
        placeholder="Digite o CEP"
        maxLength={8}
        icon={<EvilIcons name="location" size={formIconSize} color="black" />}
      />
      <CustomInput
        name={
          watchedUserType === "company" ? "company.number" : "restaurant.number"
        }
        label="Número"
        control={control}
        placeholder="Digite o número "
        icon={
          <AntDesign name="field-number" size={formIconSize} color="grey" />
        }
        keyboardType="numeric"
      />
    </View>
  );
};

export default AddressForm;
