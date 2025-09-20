import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { login } = useAuthStore();

  return (
    <SafeAreaView>
      <Text>HomeScreen</Text>

      <Button title="Sign In" onPress={login} />
    </SafeAreaView>
  );
};

export default HomeScreen;
