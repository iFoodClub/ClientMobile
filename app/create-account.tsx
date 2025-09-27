import Button from "@/components/Button/Button";
import CompanyForm from "@/components/Forms/CompanyForm/CompanyForm";
import RestaurantForm from "@/components/Forms/RestaurantForm/RestaurantForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import USerType from "@/components/UserType/USerType";
import { COLORS } from "@/src/constants/colors";
import { ICreateAccountForm } from "@/src/interfaces/interfaces";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Path, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAccount = () => {
  const { control, handleSubmit, watch, setValue, trigger } =
    useForm<ICreateAccountForm>({
      mode: "onBlur",
      defaultValues: {
        userType: null,
      },
    });
  const [step, setStep] = useState<number>(1);
  const watchedUserType = useWatch({ control, name: "userType" });

  const onSubmit: SubmitHandler<ICreateAccountForm> = (data) => {
    setStep((prev) => prev + 1);
  };

  async function handleNextStep() {
    let fieldsToValidate: Path<ICreateAccountForm>[] = [];

    if (step === 1) {
      fieldsToValidate = ["userType"];
    } else if (step === 2) {
      fieldsToValidate = ["email", "password", "confirmPassword"];
    } else if (step === 3) {
      fieldsToValidate = ["restaurant.name", "cnpj", "profileImage"];
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && step <= 3) {
      setStep((prev) => prev + 1);
    }
  }

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full px-6 ">
        <PageHeader
          title="Criar Conta"
          subtitle=" Iremos guiar você para criar a sua conta"
        />

        {step === 1 && (
          <View>
            <Text className="text-2xl mb-10">
              Você quer se cadastrar como um(a):{" "}
            </Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setValue("userType", "company")}
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
                onPress={() => setValue("userType", "restaurant")}
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
              <CompanyForm
                control={control}
                setValue={setValue}
                step={step}
                setStep={setStep}
              />
            )}
            {watchedUserType === "restaurant" && (
              <RestaurantForm
                setValue={setValue}
                step={step}
                setStep={setStep}
                control={control}
              />
            )}
          </View>
        )}

        <View className="mt-auto items-center ">
          <Button text="Seguir" onPress={handleNextStep} />
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
