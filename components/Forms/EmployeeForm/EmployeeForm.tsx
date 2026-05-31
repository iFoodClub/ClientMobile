import CustomInput from "@/components/CustomInput/CustomInput";
import { IEmployeeDTO } from "@/src/interfaces/dtos";
import { formMode } from "@/src/interfaces/interfaces";
import React from "react";
import { Control, Controller } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

type EmployeeFormProps = {
  control: Control<IEmployeeDTO>;
  mode: formMode;
};

const EmployeeForm = ({ control, mode }: EmployeeFormProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Fecha o teclado ao tocar fora */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 8,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="">
            {/* Foto de Perfil do Colaborador */}
            <Controller
              control={control}
              name="profileImage"
              rules={{
                required: { value: true, message: "A foto de perfil é obrigatória" },
              }}
              render={({ field: { value, onChange }, fieldState: { error } }) => {
                const pickImage = async () => {
                  try {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") {
                      alert("Precisamos da permissão de acesso à galeria para selecionar a foto.");
                      return;
                    }

                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      allowsEditing: true,
                      aspect: [1, 1],
                      quality: 0.8,
                    });

                    if (!result.canceled && result.assets?.[0]?.uri) {
                      onChange(result.assets[0].uri);
                    }
                  } catch (err) {
                    console.error("[ImagePicker] Erro ao selecionar:", err);
                  }
                };

                return (
                  <View className="items-center mb-6">
                    <TouchableOpacity
                      onPress={pickImage}
                      activeOpacity={0.8}
                      className="relative"
                    >
                      <View className="w-24 h-24 rounded-full border-4 border-gray-100 bg-gray-50 shadow-md items-center justify-center overflow-hidden">
                        {value ? (
                          <Image
                            source={{ uri: value }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons name="person-outline" size={36} color="#9CA3AF" />
                        )}
                      </View>
                      {/* Badge da câmera */}
                      <View className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full items-center justify-center border-2 border-white shadow-md">
                        <Ionicons name="camera" size={14} color="white" />
                      </View>
                    </TouchableOpacity>
                    <Text className="text-gray-500 text-xs mt-2 font-medium">Toque para alterar a foto do funcionário</Text>
                    {error && (
                      <Text className="text-red-500 text-xs mt-1 font-semibold">{error.message}</Text>
                    )}
                  </View>
                );
              }}
            />

            <CustomInput
              control={control}
              name="name"
              label="Nome"
              rules={{
                required: { value: true, message: "O nome é obrigatório" },
              }}
              placeholder="Digite o nome"
            />

            <CustomInput
              control={control}
              name="employee.birthDate"
              label="Data de nascimento"
              placeholder="Ex: 1999-01-01"
              maxLength={10}
              rules={{
                required: {
                  value: true,
                  message: "A data de nascimento é obrigatória.",
                },
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: "Formato inválido. Use AAAA-MM-DD (ex: 1997-06-30).",
                },
              }}
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

            {mode === formMode.create && (
              <>
                <CustomInput
                  placeholder="Digite a senha"
                  control={control}
                  name="password"
                  label="Senha"
                  rules={{
                    minLength: {
                      value: 6,
                      message: "A senha precisa ter 6 caracteres",
                    },
                    required: { value: true, message: "A senha é obrigatória" },
                  }}
                />
                <CustomInput
                  placeholder="Confirme a senha"
                  control={control}
                  name="password2"
                  label="Confirme a senha"
                  rules={{
                    minLength: {
                      value: 6,
                      message: "A senha precisa ter 6 caracteres",
                    },
                    required: { value: true, message: "A senha é obrigatória" },
                  }}
                />
              </>
            )}

            <CustomInput
              placeholder="Digite o CPF"
              control={control}
              name="cpf"
              label="CPF"
              maxLength={11}
              keyboardType="numeric"
              rules={{
                required: { value: true, message: "O CPF é obrigatório" },
              }}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EmployeeForm;
