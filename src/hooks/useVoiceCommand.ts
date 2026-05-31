import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

import { IRestaurantResponse } from "../interfaces/apiResponses";
import {
  matchCompanyVoice,
  matchEmployeeVoice,
  VoiceMatch,
} from "../utils/voiceCommandMatcher";
// Importações dinâmicas e seguras para evitar travamentos no Expo Go
let ExpoSpeechRecognitionModule: any;
let useSpeechRecognitionEvent: (event: string, callback: (...args: any[]) => void) => void;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const speech = require("expo-speech-recognition");
  ExpoSpeechRecognitionModule = speech.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = speech.useSpeechRecognitionEvent;
} catch {
  // Mock seguro para o Expo Go (onde o módulo nativo de reconhecimento de fala não existe no container)
  ExpoSpeechRecognitionModule = {
    requestPermissionsAsync: async () => ({ granted: false }),
    start: () => {},
    stop: () => {},
  };
  useSpeechRecognitionEvent = () => {};
}

export type VoiceCommandMode = "company" | "employee";

export interface UseVoiceCommandOptions {
  mode: VoiceCommandMode;
  /** Necessário no modo empresa para localizar restaurante pelo nome. */
  restaurants?: IRestaurantResponse[];
  onMatch: (match: VoiceMatch) => void;
  /** Quando false, não inicia STT (ex.: tela em loading). */
  enabled?: boolean;
}

export function useVoiceCommand({
  mode,
  restaurants = [],
  onMatch,
  enabled = true,
}: UseVoiceCommandOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const lastTranscriptRef = useRef("");
  const handledFinalRef = useRef(false);
  const optsRef = useRef({ mode, restaurants, onMatch });
  optsRef.current = { mode, restaurants, onMatch };

  const applyMatch = useCallback((text: string) => {
    const { mode: m, restaurants: rs, onMatch: cb } = optsRef.current;
    if (!text.trim()) return;

    let match: VoiceMatch;
    if (m === "company") {
      match = matchCompanyVoice(text, rs ?? []);
    } else {
      match = matchEmployeeVoice(text);
    }
    cb(match);
  }, []);

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    handledFinalRef.current = false;
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    const t = lastTranscriptRef.current.trim();
    if (!handledFinalRef.current && t) {
      handledFinalRef.current = true;
      applyMatch(t);
    }
  });

  useSpeechRecognitionEvent("result", (ev) => {
    const t = ev.results[0]?.transcript ?? "";
    lastTranscriptRef.current = t;
    setTranscript(t);
    if (ev.isFinal && t.trim()) {
      handledFinalRef.current = true;
      applyMatch(t.trim());
    }
  });

  useSpeechRecognitionEvent("error", (ev) => {
    setIsListening(false);
    if (ev.error === "aborted") return;
    setError(ev.message || String(ev.error));
  });

  const startListening = useCallback(async () => {
    if (!enabled) return;

    if (Platform.OS === "web") {
      Alert.alert(
        "Comandos de voz",
        "O reconhecimento de voz funciona no app Android ou iOS (recomendado: development build com expo-speech-recognition)."
      );
      return;
    }

    try {
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        setError("Permissão de microfone ou reconhecimento de voz negada.");
        return;
      }

      lastTranscriptRef.current = "";
      setTranscript("");
      setError(null);
      handledFinalRef.current = false;

      const names = (restaurants ?? [])
        .map((r) => r.name)
        .filter(Boolean)
        .slice(0, 30);

      ExpoSpeechRecognitionModule.start({
        lang: "pt-BR",
        interimResults: true,
        continuous: false,
        maxAlternatives: 1,
        ...(mode === "company" && names.length > 0
          ? { contextualStrings: names }
          : {}),
      });

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao iniciar o microfone.";
      setError(msg);
      Alert.alert("Voz", msg);
    }
  }, [enabled, mode, restaurants]);

  const stopListening = useCallback(async () => {
    try {
      ExpoSpeechRecognitionModule.stop();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* noop */
    }
  }, []);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}

export type { VoiceMatch } from "../utils/voiceCommandMatcher";
