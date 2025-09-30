import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import PageHeader from "@/components/PageHeader/PageHeader";
import { ISignInForm } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//icons

const SignInScreen = () => {
  const { login, user } = useAuthStore();
  const { control, handleSubmit } = useForm<ISignInForm>({
    mode: "onBlur",
    defaultValues: { email: "admin@tech.com", password: "restaurante123" },
  });

  const handleSignIn: SubmitHandler<ISignInForm> = async (data) => {
    login(data.email, data.password);
  };

  const onSubmit: SubmitHandler<ISignInForm> = (data) => console.log(data);

  return (
    <SafeAreaView className="px-6 py-4 bg-white flex-1">
      <PageHeader
        title="Bem vindo de volta!"
        subtitle="Digite suas credenciais para entrar na sua conta"
      />

      <View className="gap-4">
        <CustomInput
          control={control}
          name="email"
          label="Email"
          placeholder="seu@email.com"
          rules={{ required: "Email é obrigatório" }}
          keyboardType="email-address"
          icon={<FontAwesome name="envelope-o" size={20} color="black" />}
        />
        <CustomInput
          control={control}
          name="password"
          label="Senha"
          placeholder="••••••••"
          rules={{ required: "Senha é obrigatória" }}
          secureTextEntry
          icon={<AntDesign name="lock" size={20} color="black" />}
        />
      </View>

      <View className="mt-auto items-center">
        <Button text="Entrar" onPress={handleSubmit(handleSignIn)} />

        <Text className="mt-4 ">
          Não tem uma conta ?{" "}
          <Link className="text-primary font-semibold" href="/create-account">
            Criar Conta
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
