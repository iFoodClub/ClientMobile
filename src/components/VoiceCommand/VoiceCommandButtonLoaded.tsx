import { COLORS } from "@/src/constants/colors";
import {
  useVoiceCommand,
  VoiceCommandMode,
  VoiceMatch,
} from "@/src/hooks/useVoiceCommand";
import { IRestaurantResponse } from "@/src/interfaces/apiResponses";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type UiState = "idle" | "listening" | "success" | "error";

function isKnownCommand(m: VoiceMatch): boolean {
  return m.type !== "UNKNOWN";
}

export interface VoiceCommandButtonProps {
  mode: VoiceCommandMode;
  restaurants?: IRestaurantResponse[];
  onMatch: (match: VoiceMatch) => void;
  visible?: boolean;
  enabled?: boolean;
}

/**
 * Implementação do botão (só montada quando o módulo nativo existe).
 */
export default function VoiceCommandButtonLoaded({
  mode,
  restaurants,
  onMatch,
  visible = true,
  enabled = true,
}: VoiceCommandButtonProps) {
  const [uiState, setUiState] = useState<UiState>("idle");

  const { isListening, toggleListening, error } = useVoiceCommand({
    mode,
    restaurants,
    enabled,
    onMatch: (m) => {
      onMatch(m);
      if (isKnownCommand(m)) {
        setUiState("success");
        setTimeout(() => setUiState("idle"), 900);
      } else {
        setUiState("error");
        setTimeout(() => setUiState("idle"), 1400);
      }
    },
  });

  useEffect(() => {
    if (isListening) setUiState("listening");
  }, [isListening]);

  useEffect(() => {
    if (error) {
      setUiState("error");
      const t = setTimeout(() => setUiState("idle"), 1400);
      return () => clearTimeout(t);
    }
  }, [error]);

  if (!visible) return null;

  const bgColor =
    uiState === "error"
      ? "#ef4444"
      : uiState === "success"
        ? "#22c55e"
        : uiState === "listening"
          ? "#dc2626"
          : COLORS.primary;

  let iconName: "mic" | "checkmark" | "close" = "mic";
  if (uiState === "success") iconName = "checkmark";
  else if (uiState === "error") iconName = "close";

  return (
    <View style={styles.fabContainer} pointerEvents="box-none">
      <MotiView
        animate={{
          scale: uiState === "listening" ? 1.1 : 1,
        }}
        transition={{
          type: "timing",
          loop: uiState === "listening",
          repeatReverse: true,
          duration: 520,
        }}
      >
        <Pressable
          onPress={() => void toggleListening()}
          accessibilityLabel={
            isListening ? "Parar comando de voz" : "Iniciar comando de voz"
          }
          accessibilityRole="button"
        >
          <View
            className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: bgColor }}
          >
            <Ionicons name={iconName} size={26} color="white" />
          </View>
        </Pressable>
      </MotiView>
    </View>
  );
}

/** Posição fixa em StyleSheet: NativeWind + absolute às vezes não aplica `bottom`, e o botão fica em (0,0). */
const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    left: 20,
    bottom: 16,
    zIndex: 50,
    elevation: 14,
  },
});
