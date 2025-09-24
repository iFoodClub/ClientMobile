import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";
import USerType from "@/components/UserType/USerType";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IFormInput {
  userType: "company" | "restaurant" | null;
}

const CreateAccount = () => {
  const { control, handleSubmit, watch, setValue } = useForm<IFormInput>({
    defaultValues: {
      userType: null,
    },
  });
  const [step, steStep] = useState<number>(1);
  const watchedUserType = useWatch({ control, name: "userType" });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    Alert.alert("Dados Enviados", JSON.stringify(data));
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full px-6 ">
        <PageHeader
          title="Criar Conta"
          subtitle=" Iremos guiar você para criar a sua conta"
        />

        {step === 1 && (
          <View>
            <Text className="text-2xl mb-10">Eu sou um(a): </Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setValue("userType", "company")}
              >
                <USerType
                  active={watchedUserType === "company"}
                  label="Empresa"
                  icon={
                    <FontAwesome name="building-o" size={100} color="black" />
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setValue("userType", "restaurant")}
              >
                <USerType
                  label="Restaurante"
                  active={watchedUserType === "restaurant"}
                  icon={
                    <Ionicons
                      name="restaurant-outline"
                      size={100}
                      color="black"
                    />
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="mt-auto items-center ">
          <Button text="Seguir" onPress={handleSubmit(onSubmit)} />
          <Text className="mt-4">
            Já tem uma conta?{" "}
            <Link className="text-primary font-semibold" href="/sign-in">
              Login
            </Link>{" "}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccount;
