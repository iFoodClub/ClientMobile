import { useAuthStore } from "@/src/store/authStore";
import { Link } from "expo-router";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignInScreen = () => {
  const { login, isLoggedIn, shouldCreateAccount } = useAuthStore();

  console.log({ isLoggedIn, shouldCreateAccount });

  return (
    <SafeAreaView className="justify-center flex-1 p-4 gap-4">
      <Text className="">SignInScreen</Text>

      <Button title="Sign In" onPress={login} />
      <Link asChild push href="/modal">
        <Button title="Sign In" color={"red"} />
      </Link>
    </SafeAreaView>
  );
};

export default SignInScreen;
