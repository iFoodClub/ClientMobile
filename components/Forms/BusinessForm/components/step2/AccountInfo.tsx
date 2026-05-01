import CustomInput from "@/components/CustomInput/CustomInput";
import { formIconSize } from "@/src/constants/constants";
import { IBusiness, UserType } from "@/src/interfaces/interfaces";
import AuthRepository from "@/src/repository/authRepository";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Control, useWatch } from "react-hook-form";
import { View } from "react-native";

type AccountInfoProps = {
  control: Control<IBusiness>;
  watchedUserType: UserType;
};
export const AccountInfo = ({ control, watchedUserType }: AccountInfoProps) => {
  const password = useWatch({ control, name: "password" });

  return (
    <View>
      <CustomInput
        name="email"
        label="Email"
        control={control}
        placeholder="Digite o seu Email"
        keyboardType="email-address"
        icon={
          <FontAwesome name="envelope-o" size={formIconSize} color="black" />
        }
        rules={{
          required: { value: true, message: "O e-mail é obrigatório" },

          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Por favor, insira um email válido",
          },

          validate: async (value: any) => {
            try {
              if (!value) return "O e-mail é obrigatório";
              const isUsedEmail = await AuthRepository.isAvaliableEmail(String(value));
              return !isUsedEmail || "Este e-mail já está em uso.";
            } catch (_error) {
              return "Não foi possível verificar o e-mail. Tente novamente.";
            }
          },
        }}
      />
      <CustomInput
        name="password"
        label="Senha"
        control={control}
        placeholder="Digite a sua senha"
        secureTextEntry
        icon={<AntDesign name="lock" size={formIconSize} color="black" />}
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
        placeholder="Digite a sua senha novamente"
        secureTextEntry
        icon={<AntDesign name="lock" size={formIconSize} color="black" />}
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
