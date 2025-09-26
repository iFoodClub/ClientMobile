import CustomInput from "@/components/CustomInput/CustomInput";
import React from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";

type AddressFormProps = {
  control: Control<any>;
};

const AddressForm = ({ control }: AddressFormProps) => {
  return (
    <View>
      <CustomInput name="restaurant.cep" label="CEP" control={control} />
      <CustomInput name="restaurant.number" label="Número" control={control} />
    </View>
  );
};

export default AddressForm;
