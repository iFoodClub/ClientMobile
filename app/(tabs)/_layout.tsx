import useAuthStore from "@/store/auth.store";
import { Redirect } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

function TabLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View>
      <Text>TabLayout</Text>
    </View>
  );
}

export default TabLayout;
