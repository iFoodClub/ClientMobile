import Button from "@/components/Button/Button";
import BusinessForm from "@/components/Forms/BusinessForm/BusinessForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import USerType from "@/components/UserType/USerType";
import { COLORS } from "@/src/constants/colors";
import { IBusiness, UserType } from "@/src/interfaces/interfaces";
import AuthRepository from "@/src/repository/authRepository";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Path, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAccount = () => {
  const { control, handleSubmit, watch, setValue, trigger } =
    useForm<IBusiness>({
      mode: "onBlur",
    });
  const [step, setStep] = useState<number>(1);
  const watchedUserType = useWatch({ control, name: "userType" });

  const onSubmit: SubmitHandler<IBusiness> = async (data) => {
    if (watchedUserType === UserType.company) {
      if (!data?.company?.name) return;
      data = { ...data, name: data.company.name };
    }

    try {
      await AuthRepository.createBusiness(data);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Erro ao chamar createBusiness:", error.message);
        Alert.alert("Erro", error.message);
      }
    }
  };

  async function handleNextStep() {
    let fieldsToValidate: Path<IBusiness>[] = [];

    if (step === 1) {
      fieldsToValidate = ["userType"];
    } else if (step === 2) {
      fieldsToValidate = ["email", "password", "confirmPassword"];
    } else if (step === 3) {
      if (watchedUserType === UserType.company) {
        fieldsToValidate = ["company.name", "cnpj", "profileImage"];
      } else {
        fieldsToValidate = ["restaurant.name", "cnpj", "profileImage"];
      }
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && step <= 3) {
      setStep((prev) => prev + 1);
    }
  }

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full  ">
        <PageHeader
          title="Criar Conta"
          subtitle=" Iremos guiar você para criar a sua conta"
        />

        {step === 1 && (
          <View className="px-4">
            <Text className="text-2xl mb-10">
              Você quer se cadastrar como um(a):{" "}
            </Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setValue("userType", UserType.company)}
              >
                <USerType
                  active={watchedUserType === "company"}
                  label="Empresa"
                  icon={
                    <FontAwesome
                      name="building-o"
                      size={60}
                      color={
                        watchedUserType === "company" ? COLORS.primary : "black"
                      }
                    />
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setValue("userType", UserType.restaurant)}
              >
                <USerType
                  label="Restaurante"
                  active={watchedUserType === "restaurant"}
                  icon={
                    <Ionicons
                      name="restaurant-outline"
                      size={60}
                      color={
                        watchedUserType === "restaurant"
                          ? COLORS.primary
                          : "black"
                      }
                    />
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step != 1 && (
          <View>
            {watchedUserType === "company" && (
              <BusinessForm
                setValue={setValue}
                step={step}
                setStep={setStep}
                control={control}
                watchedUserType={watchedUserType}
              />
            )}
            {watchedUserType === "restaurant" && (
              <BusinessForm
                setValue={setValue}
                step={step}
                setStep={setStep}
                control={control}
                watchedUserType={watchedUserType}
              />
            )}
          </View>
        )}

        <View className="mt-auto items-center px-4 ">
          {step != 4 && <Button text="Seguir" onPress={handleNextStep} />}
          {step === 4 && (
            <Button text="Criar conta" onPress={handleSubmit(onSubmit)} />
          )}
          <Text className="mt-4">
            Já tem uma conta?{" "}
            <Link className="text-primary font-semibold" href="/sign-in">
              Entrar
            </Link>{" "}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccount;
