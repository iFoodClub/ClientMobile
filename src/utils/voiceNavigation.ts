import type { Href } from "expo-router";

/** Rotas de tabs usadas por comandos de voz (expo-router file-based). */
export type VoiceTabRoute =
  | "index"
  | "orders"
  | "employees"
  | "settings"
  | "dishes";

const TAB_HREF: Record<VoiceTabRoute, Href> = {
  index: "/(tabs)",
  orders: "/(tabs)/orders",
  employees: "/(tabs)/employees",
  settings: "/(tabs)/settings",
  dishes: "/(tabs)/dishes",
};

export function voiceTabHref(tab: VoiceTabRoute): Href {
  return TAB_HREF[tab];
}
