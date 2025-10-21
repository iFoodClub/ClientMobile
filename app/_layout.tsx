import { ToastProvider } from "@/src/components/Toast";
import { useSyncManager } from "@/src/hooks/useSyncManager";
import { useAuthStore } from "@/src/store/authStore";
import { Stack } from "expo-router";
import "./global.css";

function AppContent() {
  const { isLoggedIn } = useAuthStore();
  
  // Hook global para sincronização automática
  useSyncManager();

  return (
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
  );
}

export default function RootLayout() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
