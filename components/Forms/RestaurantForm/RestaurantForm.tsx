import CustomInput from "@/components/CustomInput/CustomInput";
import { ICreateAccountForm } from "@/src/interfaces/interfaces";
import { isAvaliableEmail } from "@/src/repository/AuthRepository";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { Text, View } from "react-native";

type RestaurantFormProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  setValue: UseFormSetValue<ICreateAccountForm>;
  control: Control<any>;
};

const RestaurantForm = ({
  setStep,
  step,
  setValue,
  control,
}: RestaurantFormProps) => {
  const password = useWatch({ control, name: "password" });

  return (
    <View>
      <Text className="text-2xl mb-10">Dados da conta </Text>

      <CustomInput
        name="email"
        label="Email"
        control={control}
        placeholder="Email"
        keyboardType="email-address"
        icon={<FontAwesome name="envelope-o" size={20} color="black" />}
        rules={{
          required: { value: true, message: "O e-mail é obrigatório" },

          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Por favor, insira um email válido",
          },

          validate: async (value) => {
            console.log(value);

            try {
              const isUsedEmail = await isAvaliableEmail(value);
              return !isUsedEmail || "Este e-mail já está em uso.";
            } catch (error) {
              return "Não foi possível verificar o e-mail. Tente novamente.";
            }
          },
        }}
      />
      <CustomInput
        name="password"
        label="Senha"
        control={control}
        placeholder="Senha"
        secureTextEntry
        icon={<AntDesign name="lock" size={20} color="black" />}
        rules={{
          required: { value: true, message: "A senha é obrigatória" },
          minLength: {
            value: 6,
            message: "A senha deve ter pelo menos 6 caracteres",
          },
        }}
      />
      <CustomInput
        name="confirmPassword"
        label="Confirmar senha"
        control={control}
        placeholder="Senha"
        secureTextEntry
        icon={<AntDesign name="lock" size={20} color="black" />}
        rules={{
          required: { value: true, message: "A senha é obrigatória" },
          minLength: {
            value: 6,
            message: "A senha deve ter pelo menos 6 caracteres",
          },
          validate: (value) => {
            return password === value || "As senhas devem ser iguais";
          },
        }}
      />
    </View>
  );
};

export default RestaurantForm;
