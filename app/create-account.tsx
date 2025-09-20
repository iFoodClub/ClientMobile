import { COLORS } from "@/src/constants/colors";
import { UserType } from "@/src/interfaces/interfaces";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserTypeSelectionProps = {
  text: string;
  isActive: boolean;
  children: React.ReactNode;
};

const UserTypeSelection = ({
  text,
  isActive,
  children,
}: UserTypeSelectionProps) => {
  return (
    <View
      className={`border self-start border-round rounded-md w-32 h-32 items-center justify-center gap-y-2 ${
        isActive ? "bg-bgPrimary border-primary" : ""
      }`}
    >
      {children}
      <Text>{text}</Text>
    </View>
  );
};

const CreateAccount = () => {
  const [userTypeSelected, setUserTypeSelected] = useState<UserType>(
    UserType.restaurant
  );

  return (
    <SafeAreaView>
      <Text className="text-2xl font-bold">Criar conta</Text>
      <Text className="text-lg">Que tipo de conta deseja criar?</Text>
      <View className="flex-row gap-6  px-4">
        <UserTypeSelection text="Pessoa física" isActive={false}>
          <FontAwesome
            name="building-o"
            size={60}
            color={
              userTypeSelected === UserType.company ? COLORS.primary : "black"
            }
          />
        </UserTypeSelection>

        {/* <View className="border self-start border-round rounded-md w-32 h-32 items-center justify-center gap-y-2 bg-bgPrimary border-primary ">
          <FontAwesome name="building-o" size={60} color={COLORS.primary} />
          <Text className="text-primary font-semibold">Empresa</Text>
        </View>
        <View className="border self-start border-round rounded-md w-32 h-32 items-center justify-center gap-y-2">
          <Ionicons name="restaurant-outline" size={60} color="black" />
          <Text>Restaurante</Text>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default CreateAccount;
