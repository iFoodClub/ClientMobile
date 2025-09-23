import CustomInput from "@/components/CustomInput/CustomInput";
import { ISignInForm } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { Link } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//icons

const SignInScreen = () => {
  const { login } = useAuthStore();
  const { control, handleSubmit } = useForm<ISignInForm>({ mode: "onBlur" });

  const handleSignIn: SubmitHandler<ISignInForm> = async (data) => {
    try {
      console.log("Enviando dados para a API:", data);

      const response = await axios.post(
        "https://foodclubserver-2r7n.onrender.com/user/login",

        {
          email: data.email,
          password: data.password,
        }
      );

      console.log("Resposta da API:", response.data);
      Alert.alert("Sucesso", "Login realizado!");

      login(response.data);
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Não foi possível fazer o login.");
    }
  };

  const onSubmit: SubmitHandler<ISignInForm> = (data) => console.log(data);

  return (
    <SafeAreaView className="px-6 py-10 bg-white flex-1">
      <View className="mb-6">
        <Text className="text-h1 font-semibold">Bem vindo de volta!</Text>
        <Text className="caption text-gray-600">
          Digite suas credenciais para entrar na sua conta
        </Text>
      </View>

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
        <TouchableOpacity
          onPress={handleSubmit(handleSignIn)}
          className="px-4 py-4 bg-primary rounded-lg flex items-center w-full"
        >
          <Text className="text-white font-semibold text-body">Entrar</Text>
        </TouchableOpacity>

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
