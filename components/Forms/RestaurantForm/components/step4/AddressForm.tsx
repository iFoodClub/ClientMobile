import CustomInput from "@/components/CustomInput/CustomInput";
import { IBusiness } from "@/src/interfaces/interfaces";
import { isValidCep } from "@/src/utils/utils";
import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { Alert, TextInputChangeEvent, View } from "react-native";

type AddressFormProps = {
  control: Control<any>;
  setValue: UseFormSetValue<IBusiness>;
};

const AddressForm = ({ control, setValue }: AddressFormProps) => {
  async function handleCEP(e: TextInputChangeEvent) {
    let cep = e.nativeEvent.text;
    if (e.nativeEvent.text.length === 9) {
      cep = e.nativeEvent.text.replace("-", "");
    }

    if (isValidCep(cep)) {
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
    }
  }

  return (
    <View>
      <CustomInput
        name="restaurant.cep"
        label="CEP"
        control={control}
        keyboardType="numeric"
        onChange={handleCEP}
        maxLength={9}
      />
      <CustomInput name="restaurant.number" label="Número" control={control} />
    </View>
  );
};

export default AddressForm;
