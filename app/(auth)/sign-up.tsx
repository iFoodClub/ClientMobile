import CustomButton from "@/components/CustomButton/CustomButton";
import CustomInput from "@/components/CustomInput/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const { name, email, password } = form;

  const submit = async () => {
    if (!email || !password || !name) {
      return Alert.alert("Error", "Preencha todos os campos");
    }

    setIsSubmitting(true);

    try {
      await createUser({
        email,
        password,
        name,
      });

      Alert.alert("Success", "Cadastro realizado com sucesso");
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
        placeholder="Entre com seu nome"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label="Nome"
      />
      <CustomInput
        placeholder="Entre com seu email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Entre com a sua senha"
        value={form.password}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, password: text }));
        }}
        label="Senha"
        secureTextEntry
      />
      <CustomButton
        title="Cadastrar"
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className="flex justift-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">Já tem uma conta ? </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Entrar
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
