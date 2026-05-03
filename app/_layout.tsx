import { ToastProvider } from "@/src/components/Toast";
import React, { useEffect, useState } from "react";
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
import * as SplashScreen from 'expo-splash-screen';
import { AnimatedSplashScreen } from "@/src/components/AnimatedSplashScreen";
import "./global.css";

// Impede que a splash nativa suma automaticamente
SplashScreen.preventAutoHideAsync();

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
      {isLoggedIn ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="restaurant-details"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="perfil-form"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="sign-in"
            options={{ headerShown: false, animation: "slide_from_left" }}
          />
          <Stack.Screen
            name="create-account"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </>
      )}

      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Quando as fontes carregam, escondemos a splash nativa
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#FF6D00' }} />;
  }

  return (
    <ToastProvider>
      {!splashAnimationFinished && (
        <AnimatedSplashScreen onAnimationFinish={() => setSplashAnimationFinished(true)} />
      )}
      <AppContent />
    </ToastProvider>
  );
}
