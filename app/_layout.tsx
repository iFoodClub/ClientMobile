import { useAuthStore } from "@/src/store/authStore";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, shouldCreateAccount, reset } = useAuthStore();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
      {/* <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="create-account" options={{ headerShown: false }} />
      </Stack.Protected> */}
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
