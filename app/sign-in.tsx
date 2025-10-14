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
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//icons

const SignInScreen = () => {
  const { login, user, loading } = useAuthStore();

  const { control, handleSubmit, reset } = useForm<ISignInForm>({
    mode: "onBlur",
    defaultValues: { email: "admin@tech.com", password: "restaurante123" },
  });

  const testAccounts = [
    { label: "Empresa", email: "company@tech.com", password: "empresa123" },
    {
      label: "Restaurante",
      email: "admin@tech.com",
      password: "restaurante123",
    },
  ];

  const handleSignIn: SubmitHandler<ISignInForm> = async (data) => {
    login(data.email, data.password);
  };

  return (
    <SafeAreaView className=" py-4 bg-white flex-1">
      <PageHeader
        title="Bem vindo de volta!"
        subtitle="Digite suas credenciais para entrar na sua conta"
      />

      <View className="gap-4 px-4">
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

      <View className="mt-auto items-center px-4">
        {__DEV__ && (
          <View className="flex-row flex-wrap justify-center gap-2 mb-4">
            {testAccounts.map((account) => (
              <TouchableOpacity
                key={account.label}
                className="bg-gray-200 px-3 py-2 rounded-md"
                onPress={() =>
                  reset({ email: account.email, password: account.password })
                }
              >
                <Text className="font-semibold">{account.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Button
          loading={loading}
          text="Entrar"
          onPress={handleSubmit(handleSignIn)}
        />

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
