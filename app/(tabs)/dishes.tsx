import Button from "@/components/Button/Button";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dishes = () => {
  return (
    <SafeAreaView>
      <Text>dishes</Text>
      <Button text="Novo prato" onPress={() => {}} />
    </SafeAreaView>
  );
};

export default dishes;
