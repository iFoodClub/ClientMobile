import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const { logout } = useAuthStore();

  return (
    <SafeAreaView>
      <Text>SettingsScreen</Text>

      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
};

export default SettingsScreen;
