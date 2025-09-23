import { Link } from "expo-router";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IFormInput {
  firstName: string;
  lastName: string;
  age: number;
}

const CreateAccount = () => {
  // Para React Native, usamos o `control`
  const { control, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    Alert.alert("Dados Enviados", JSON.stringify(data));
  };

  return (
    <SafeAreaView>
      {/* 1. Trocamos a tag <form> por <View> */}
      <View style={{ padding: 20, gap: 15 }}>
        {/* 2. Trocamos <input> com `register` pelo componente <Controller> */}
        <Controller
          control={control}
          name="firstName"
          rules={{ required: true, maxLength: 20 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Primeiro Nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ borderWidth: 1, padding: 10 }}
              secureTextEntry
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          rules={{ pattern: /^[A-Za-z]+$/i }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Último Nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ borderWidth: 1, padding: 10 }}
            />
          )}
        />

        <Controller
          control={control}
          name="age"
          rules={{ min: 18, max: 99 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Idade"
              onBlur={onBlur}
              // O `onChange` espera uma string, então garantimos a conversão
              onChangeText={(text) => onChange(Number(text) || 0)}
              value={value ? String(value) : ""}
              keyboardType="numeric"
              style={{ borderWidth: 1, padding: 10 }}
            />
          )}
        />
        <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
        <Text>
          Já tem uma conta? <Link href="/sign-in">Login</Link>{" "}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccount;
