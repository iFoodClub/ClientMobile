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
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="perfil-form"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="sign-in"
            options={{ headerShown: false, animation: "slide_from_left" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="create-account"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </Stack.Protected>
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ToastProvider>
  );
}
