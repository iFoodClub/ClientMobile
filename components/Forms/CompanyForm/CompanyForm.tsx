import React from "react";
import { Text, View } from "react-native";

type CompanyFormProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  setValue: any;
  control: any;
};

const CompanyForm = ({
  setStep,
  step,
  setValue,
  control,
}: CompanyFormProps) => {
  return (
    <View>
      <Text>CompanyForm</Text>
    </View>
  );
};

export default CompanyForm;
