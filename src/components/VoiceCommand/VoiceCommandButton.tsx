import React, { Suspense, useState } from "react";
import type { VoiceCommandButtonProps } from "./VoiceCommandButtonLoaded";

const VoiceCommandButtonLoaded = React.lazy(
  () => import("./VoiceCommandButtonLoaded")
);

function probeNativeSpeechModule(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("expo-speech-recognition");
    return true;
  } catch {
    return false;
  }
}

/**
 * Botão flutuante de comando de voz. Só carrega o JS do reconhecimento de voz
 * se o módulo nativo existir (development build); evita crash ao abrir no Expo Go.
 */
export function VoiceCommandButton(props: VoiceCommandButtonProps) {
  const [nativeOk] = useState(probeNativeSpeechModule);

  if (!nativeOk) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <VoiceCommandButtonLoaded {...props} />
    </Suspense>
  );
}

export type { VoiceCommandButtonProps } from "./VoiceCommandButtonLoaded";
