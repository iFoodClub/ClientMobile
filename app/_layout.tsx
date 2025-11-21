import { ToastProvider } from "@/src/components/Toast";
import { useSyncManager } from "@/src/hooks/useSyncManager";
import { useAuthStore } from "@/src/store/authStore";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
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
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
