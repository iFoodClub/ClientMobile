import { ToastProvider } from "@/src/components/Toast";
import { useAuthStore } from "@/src/store/authStore";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  const { isLoggedIn } = useAuthStore();

  return (
    <ToastProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="restaurant-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="perfil-form" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="create-account"
            options={{ headerShown: false }}
          />
        </Stack.Protected>
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ToastProvider>
  );
}
