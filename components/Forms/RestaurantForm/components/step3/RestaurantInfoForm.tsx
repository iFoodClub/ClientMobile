import { ICreateAccountForm } from "@/src/interfaces/interfaces";
import React from "react";
import { Control } from "react-hook-form";
import { Text, View } from "react-native";

type RestaurantInfoFormProps = {
  control: Control<ICreateAccountForm>;
};

const RestaurantInfoForm = ({ control }: RestaurantInfoFormProps) => {
  return (
    <View>
      <Text>RestaurantInfoForm</Text>
    </View>
  );
};

export default RestaurantInfoForm;
