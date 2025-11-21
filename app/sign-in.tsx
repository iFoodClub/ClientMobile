import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations } from "@/src/db";
import { ISignInForm } from "@/src/interfaces/interfaces";
import { LocalAuthRepository } from "@/src/repository/localAuthRepository";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import { useAuthStore } from "@/src/store/authStore";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import NetInfo from "@react-native-community/netinfo";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignInScreen = () => {
  const { login, user, loading, isLoggedIn } = useAuthStore();
  const { showError } = useToastAll();

  const { control, handleSubmit, reset } = useForm<ISignInForm>({
    mode: "onBlur",
    defaultValues: { email: "admin@tech.com", password: "restaurante123" },
  });

  useEffect(() => {}, []);

  const testAccounts = [
    { label: "Empresa", email: "company@tech.com", password: "empresa123" },
    {
      label: "Restaurante",
      email: "admin@tech.com",
      password: "restaurante123",
    },
    {
      label: "Funcionario 1",
      email: "maria@gmail.com",
      password: "123456",
    },
    {
      label: "Funcionario 2",
      email: "pedro@gmail.com",
      password: "123456",
    },
  ];

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    runMigrations();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, []);

  const handleOfflineAccess = async (email: string) => {
    let canLogin = false;
    let perfilLocal = null;

    if (user?.id) {
      canLogin = LocalAuthRepository.isLoginWithin24h(String(user.id));
      perfilLocal = LocalProfileRepository.getProfile(String(user.id));
    }

    if (!canLogin) {
      canLogin = LocalAuthRepository.isLoginWithin24h(email);
      if (!perfilLocal) {
        perfilLocal = LocalProfileRepository.getProfile(email);
      }
    }

    if ((canLogin || isLoggedIn) && perfilLocal) {
      useAuthStore.getState().loginOffline(perfilLocal);
      router.replace("/");
      return true;
    }

    showError(
      "Login offline indisponível para este usuário. Faça login online pelo menos uma vez."
    );
    return false;
  };

  const handleSignIn: SubmitHandler<ISignInForm> = async (data) => {
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
      const allowed = await handleOfflineAccess(data.email);
      if (!allowed) {
        return;
      }
      return;
    }

    try {
      await login(data.email, data.password);

      setTimeout(() => {
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.id && currentUser?.email) {
          const nowTs = Math.floor(Date.now() / 1000);
          LocalAuthRepository.upsertLastLoginOffline(
            String(currentUser.id),
            currentUser.email,
            nowTs
          );
        }
      }, 1000);
    } catch (error) {
      showError("Erro no login online!");
    }
  };

  return (
    <SafeAreaView className="py-4 bg-white flex-1">
      {isOffline && (
        <View
          style={{
            backgroundColor: "#fcc",
            padding: 14,
            margin: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#a00" }}>
            Você está sem internet. Login offline disponível apenas para quem
            fez login nas últimas 24h.
          </Text>
        </View>
      )}
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
