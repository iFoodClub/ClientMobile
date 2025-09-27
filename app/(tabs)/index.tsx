import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView>
      <Text>HomeScreen</Text>
      <Text>{user?.name}</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
