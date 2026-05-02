import type { VoiceTabRoute } from "./voiceNavigation";
import { IRestaurantResponse } from "../interfaces/apiResponses";

/** Comandos reconhecidos para a empresa. */
export type CompanyVoiceMatch =
  | { type: "RESTAURANTES" }
  | { type: "FAVORITOS" }
  | { type: "NAVIGATE_RESTAURANT"; restaurantId: number; name: string }
  | { type: "NAVIGATE_TAB"; tab: VoiceTabRoute }
  | { type: "UNKNOWN"; transcript: string };

/** Comandos reconhecidos para o funcionário. */
export type EmployeeVoiceMatch =
  | { type: "PEDIDO_DO_DIA" }
  | { type: "NAVIGATE_TAB"; tab: VoiceTabRoute }
  | { type: "UNKNOWN"; transcript: string };

export type VoiceMatch = CompanyVoiceMatch | EmployeeVoiceMatch;

export type { VoiceTabRoute } from "./voiceNavigation";

const PEDIDO_DO_DIA_ALIASES = [
  "pedido do dia",
  "pratos do dia",
  "prato do dia",
  "menu do dia",
  "cardapio",
  "cardápio",
  "pedido dia",
  "comida do dia",
];

const RESTAURANTES_ALIASES = [
  "restaurantes",
  "lista de restaurantes",
  "ver restaurantes",
  "mostrar restaurantes",
  "todos os restaurantes",
  "listar restaurantes",
];

const FAVORITOS_ALIASES = [
  "favoritos",
  "meus favoritos",
  "restaurantes favoritos",
  "curtidos",
  "lista de favoritos",
];

/** Separador Pedidos — empresa e funcionário. */
const PEDIDOS_TAB_ALIASES = [
  "pedidos",
  "meus pedidos",
  "ver pedidos",
  "lista de pedidos",
  "historico de pedidos",
  "histórico de pedidos",
];

/** Separador Funcionários — só empresa (matcher só corre no modo company). */
const FUNCIONARIOS_TAB_ALIASES = [
  "funcionarios",
  "funcionários",
  "equipe",
  "colaboradores",
  "meus funcionarios",
  "meus funcionários",
  "time",
];

/** Separador Perfil. */
const PERFIL_TAB_ALIASES = [
  "perfil",
  "minha conta",
  "configuracoes",
  "configurações",
  "ajustes",
  "minhas configuracoes",
  "minhas configurações",
];

/** Início / home (lista principal). */
const INICIO_TAB_ALIASES = [
  "inicio",
  "início",
  "home",
  "tela inicial",
  "voltar ao inicio",
  "voltar ao início",
  "ir para inicio",
  "restaurantes inicio",
];

/**
 * Funcionário: ir ao separador Pratos (sem conflitar com "cardápio" → pedido do dia).
 */
const PRATOS_TAB_ALIASES = [
  "aba pratos",
  "tela de pratos",
  "ir para pratos",
  "secao pratos",
  "seção pratos",
  "lista de pratos",
  "ver aba pratos",
];

/** Remove acentos, minúsculas, espaços extras. */
export function normalizeVoiceText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function includesAlias(text: string, aliases: string[]): boolean {
  const n = normalizeVoiceText(text);
  return aliases.some((a) => n.includes(normalizeVoiceText(a)));
}

/** Distância de Levenshtein (strings curtas). */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost
      );
    }
  }
  return dp[m]![n]!;
}

/**
 * Encontra restaurante pelo nome falado (substring ou Levenshtein tolerante).
 */
export function findRestaurantByVoiceName(
  transcript: string,
  restaurants: IRestaurantResponse[]
): IRestaurantResponse | null {
  const norm = normalizeVoiceText(transcript);
  if (!norm || restaurants.length === 0) return null;

  for (const r of restaurants) {
    const nameNorm = normalizeVoiceText(r.name);
    if (!nameNorm) continue;
    if (norm.includes(nameNorm) || nameNorm.includes(norm)) {
      return r;
    }
  }

  const words = norm.split(/\s+/).filter((w) => w.length >= 3);
  for (const r of restaurants) {
    const nameNorm = normalizeVoiceText(r.name);
    for (const w of words) {
      if (nameNorm.includes(w)) return r;
    }
  }

  let best: IRestaurantResponse | null = null;
  let bestScore = Infinity;
  for (const r of restaurants) {
    const nameNorm = normalizeVoiceText(r.name);
    if (!nameNorm) continue;
    const d = levenshtein(norm, nameNorm);
    const threshold = Math.max(4, Math.floor(nameNorm.length / 2) + 2);
    if (d < bestScore && d <= threshold) {
      bestScore = d;
      best = r;
    }
  }
  return best;
}

export function matchCompanyVoice(
  transcript: string,
  restaurants: IRestaurantResponse[]
): CompanyVoiceMatch {
  const raw = transcript.trim();
  if (!raw) {
    return { type: "UNKNOWN", transcript: raw };
  }

  if (includesAlias(raw, RESTAURANTES_ALIASES)) {
    return { type: "RESTAURANTES" };
  }

  if (includesAlias(raw, FAVORITOS_ALIASES)) {
    return { type: "FAVORITOS" };
  }

  if (includesAlias(raw, INICIO_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "index" };
  }

  if (includesAlias(raw, PEDIDOS_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "orders" };
  }

  if (includesAlias(raw, FUNCIONARIOS_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "employees" };
  }

  if (includesAlias(raw, PERFIL_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "settings" };
  }

  const byName = findRestaurantByVoiceName(raw, restaurants);
  if (byName) {
    return {
      type: "NAVIGATE_RESTAURANT",
      restaurantId: byName.id,
      name: byName.name,
    };
  }

  return { type: "UNKNOWN", transcript: raw };
}

export function matchEmployeeVoice(transcript: string): EmployeeVoiceMatch {
  const raw = transcript.trim();
  if (!raw) {
    return { type: "UNKNOWN", transcript: raw };
  }

  if (includesAlias(raw, PEDIDO_DO_DIA_ALIASES)) {
    return { type: "PEDIDO_DO_DIA" };
  }

  if (includesAlias(raw, PRATOS_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "dishes" };
  }

  if (includesAlias(raw, INICIO_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "index" };
  }

  if (includesAlias(raw, PEDIDOS_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "orders" };
  }

  if (includesAlias(raw, PERFIL_TAB_ALIASES)) {
    return { type: "NAVIGATE_TAB", tab: "settings" };
  }

  return { type: "UNKNOWN", transcript: raw };
}
