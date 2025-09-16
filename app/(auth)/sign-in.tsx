import CustomButton from "@/components/CustomButton/CustomButton";
import CustomInput from "@/components/CustomInput/CustomInput";
import { signIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const { email, password } = form;

  const submit = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Preencha todos os campos");
    }

    setIsSubmitting(true);

    try {
      await signIn({ email, password });
      router.replace("/");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Entre com seu email"
        value={email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Entre com a sua senha"
        value={password}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, password: text }));
        }}
        label="Senha"
        secureTextEntry
      />
      <CustomButton title="Entrar" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justift-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">Não tem uma conta? </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Cadastre-se
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
