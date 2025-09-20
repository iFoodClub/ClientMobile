import { UserType } from "@/src/interfaces/interfaces";
import React, { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAccount = () => {
  const [userTypeSelected, setUserTypeSelected] = useState<UserType>(
    UserType.company
  );

  return (
    <SafeAreaView>
      <Text>CreateAccount</Text>
    </SafeAreaView>
  );
};

export default CreateAccount;
