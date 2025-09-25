import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

const api = axios.create({ baseURL });

export async function isAvaliableEmail(email: string) {
  try {
    const response = await api.get<{ exists: boolean }>(
      `/user/check-email/${email}`
    );
    // A API retorna `{ exists: true }` ou `{ exists: false }`
    return response.data.exists;
  } catch (error) {
    // Se a API falhar, não podemos validar, então relançamos o erro
    console.error("API de verificação de email falhou:", error);
    throw new Error("Não foi possível verificar o email. Tente novamente.");
  }
}
