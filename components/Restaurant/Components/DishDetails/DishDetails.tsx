import { IDish } from "@/src/interfaces/apiResponses";
import React from "react";
import { Text, View } from "react-native";

type DishDetailsProps = {
  dish: IDish;
};

const DishDetails = (props: DishDetailsProps) => {
  return (
    <View>
      <Text>DishDetails</Text>
    </View>
  );
};

export default DishDetails;
