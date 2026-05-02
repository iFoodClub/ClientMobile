function sanitizeBaseUrl(url: string | undefined): string | undefined {
  if (url == null) return undefined;
  const t = String(url).trim();
  if (!t) return undefined;
  return t.replace(/\/$/, "");
}

/**
 * Base da API — só `EXPO_PUBLIC_API_BASE_URL` no `.env` na raiz do projeto.
 * Após mudar o `.env`, reinicia o Metro (`npx expo start`).
 */
export function getApiBaseUrl(): string {
  const url = sanitizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  if (!url) {
    const hint =
      "Defina EXPO_PUBLIC_API_BASE_URL no .env (ex.: http://192.168.1.10:3000)";
    if (__DEV__) {
      console.error("[API]", hint);
    }
    throw new Error(hint);
  }
  return url;
}
