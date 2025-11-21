import CustomInput from "@/components/CustomInput/CustomInput";
import { IEmployeeDTO } from "@/src/interfaces/dtos";
import { formMode } from "@/src/interfaces/interfaces";

import React from "react";
import { cpfMask, dateMask } from "@/src/utils/masks";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Pressable, ScrollView, Text, TextInput, View, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";
import { Control } from "react-hook-form";

type EmployeeFormProps = {
  control: Control<IEmployeeDTO>;
  mode: formMode;
};

const EmployeeForm = ({ control, mode }: EmployeeFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <ScrollView className=" px-4 ">
      <CustomInput
        control={control}
        name="name"
        label="Nome"
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
        placeholder="Digite o nome"
      />
      
      {/* Data de nascimento com máscara DD/MM/AAAA */}
      <Controller
        control={control}
        name="employee.birthDate"
        rules={{
          required: {
            value: true,
            message: "A data de nascimento é obrigatória.",
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View className="w-full">
              <Text className="text-sm font-semibold text-gray-600 mb-1">
                Data de nascimento
              </Text>
              <View
                className={`justify-center border flex flex-row items-center rounded-lg text-base p-1 pl-4 ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                }`}
              >
                <TextInput
                  keyboardType="numeric"
                  className={`text-base flex-1 ${
                    error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const maskedValue = dateMask(text);
                    onChange(maskedValue);
                  }}
                  value={value || ""}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={"#9CA3AF"}
                  maxLength={10}
                />
              </View>
              <View className="h-[20px] flex items-end">
                {error && (
                  <Text className="text-red-500 text-sm">{error.message}</Text>
                )}
              </View>
            </View>
          </>
        )}
      />
      
      <CustomInput
        control={control}
        placeholder="Digite o email"
        name="email"
        label="E-mail"
        rules={{
          required: { value: true, message: "O e-mail é obrigatório" },
        }}
      />
      
      {/* Senha com toggle de visibilidade */}
      {mode === formMode.create && (
        <Controller
          control={control}
          name="password"
          rules={{
            minLength: {
              value: 6,
              message: "A senha precisa ter 6 caracteres",
            },
            required: { value: true, message: "A senha é obrigatória" },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <View className="w-full">
                <Text className="text-sm font-semibold text-gray-600 mb-1">
                  Senha
                </Text>
                <View
                  className={`justify-center border flex flex-row items-center rounded-lg text-base p-1 pl-4 ${
                    error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <TextInput
                    className={`text-base flex-1 ${
                      error
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                    placeholder="Digite a senha"
                    placeholderTextColor={"#9CA3AF"}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-3"
                  >
                    <AntDesign
                      name={showPassword ? "eye" : "eyeinvisible"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
                <View className="h-[20px] flex items-end">
                  {error && (
                    <Text className="text-red-500 text-sm">
                      {error.message}
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}
        />
      )}
      
      {/* Confirmação de senha com toggle de visibilidade */}
      {mode === formMode.create && (
        <Controller
          control={control}
          name="password2"
          rules={{
            minLength: {
              value: 6,
              message: "A senha precisa ter 6 caracteres",
            },
            required: { value: true, message: "A senha é obrigatória" },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <View className="w-full">
                <Text className="text-sm font-semibold text-gray-600 mb-1">
                  Confirme a senha
                </Text>
                <View
                  className={`justify-center border flex flex-row items-center rounded-lg text-base p-1 pl-4 ${
                    error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <TextInput
                    className={`text-base flex-1 ${
                      error
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                    placeholder="Confirme a senha"
                    placeholderTextColor={"#9CA3AF"}
                    secureTextEntry={!showPassword2}
                  />
                  <Pressable
                    onPress={() => setShowPassword2(!showPassword2)}
                    className="px-3"
                  >
                    <AntDesign
                      name={showPassword2 ? "eye" : "eyeinvisible"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
                <View className="h-[20px] flex items-end">
                  {error && (
                    <Text className="text-red-500 text-sm">
                      {error.message}
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}
        />
      )}
      
      <CustomInput
        placeholder="Insira a imagem"
        control={control}
        name="profileImage"
        label="Imagem do perfil"
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
      
      {/* CPF com máscara */}
      <Controller
        control={control}
        name="cpf"
        rules={{ required: { value: true, message: "O CPF é obrigatório" } }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View className="w-full">
              <Text className="text-sm font-semibold text-gray-600 mb-1">
                CPF
              </Text>
              <View
                className={`justify-center border flex flex-row items-center rounded-lg text-base p-1 pl-4 ${
                  error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                }`}
              >
                <TextInput
                  keyboardType="numeric"
                  className={`text-base flex-1 ${
                    error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const maskedValue = cpfMask(text);
                    onChange(maskedValue);
                  }}
                  value={value || ""}
                  placeholder="000.000.000-00"
                  placeholderTextColor={"#9CA3AF"}
                  maxLength={14}
                />
              </View>
              <View className="h-[20px] flex items-end">
                {error && (
                  <Text className="text-red-500 text-sm">{error.message}</Text>
                )}
              </View>
            </View>
          </>
        )}
      />
    </ScrollView>
  );
};

export default EmployeeForm;
