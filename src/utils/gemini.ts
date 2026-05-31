/**
 * Serviço de Integração com o Google Gemini (Free Tier: gemini-1.5-flash)
 * Realiza chamadas HTTP puras (sem SDK pesado) sendo 100% seguro para rodar no Expo Go.
 */

export async function generateGeminiResponse(prompt: string, contextData?: any): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API Key não configurada no .env (EXPO_PUBLIC_GEMINI_API_KEY).");
  }

  // Lista resiliente de modelos prioritários (do mais novo ao estável)
  // Otimizada com base nos limites de cota reais do usuário (ex: Gemini 3.1 Flash Lite tem 500 RPD)
  const models = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3-flash",
    "gemini-2.5-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-pro"
  ];

  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

      let fullPrompt = "";

      if (contextData) {
        fullPrompt = `Você é o Assistente Virtual inteligente do aplicativo iFoodClub (plataforma de agendamento de almoços e entregas corporativas).
O usuário fez a seguinte pergunta: "${prompt}".

Temos os seguintes dados estruturados reais do nosso banco de dados para nos apoiar na resposta:
${JSON.stringify(contextData, null, 2)}

INSTRUÇÕES IMPORTANTES:
1. Responda à pergunta do usuário de forma extremamente curta, simpática e profissional em português. Seja muito conciso e vá direto ao ponto; os usuários são colaboradores da empresa e têm pouco tempo.
2. Baseie-se ESTRITAMENTE nos dados reais fornecidos acima. Formule a lista, status ou detalhes de forma super compacta.
3. Formate a resposta de forma altamente legível e rápida usando listas curtas e negrito (**termo**) do markdown.
4. Nunca invente ou fabrique dados de pratos, preços, restaurantes ou nomes que não constem no JSON fornecido.
5. Se o JSON de dados estiver vazio, diga educadamente e em poucas palavras que não há registros ativos no momento.
6. Nunca mencione o termo "JSON", "APIs" ou "banco de dados". Fale como se você soubesse disso naturalmente.`;
      } else {
        fullPrompt = `Você é o Assistente Virtual inteligente do aplicativo iFoodClub (um aplicativo de agendamento e entrega de refeições corporativas).
O usuário enviou a seguinte mensagem: "${prompt}".

INSTRUÇÕES IMPORTANTES:
1. Responda de forma extremamente concisa, simpática e prestativa em português. Vá direto ao ponto!
2. Esclareça a dúvida dele de maneira muito breve e direta no contexto do iFoodClub.
3. Se ele estiver te cumprimentando, responda com uma saudação rápida e liste de forma muito sintética as coisas que você pode fazer (ex: ver restaurantes, pratos do dia, pedidos ou equipe).
4. Evite textos longos, parágrafos grandes ou explicações demoradas. Use apenas markdown super simplificado (listas rápidas e negrito).`;
      }

      console.log(`🤖 [Chatbot Gemini] Tentando conectar via modelo: ${model}...`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Erro HTTP ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error("Resposta do Gemini vazia.");
      }

      console.log(`✅ [Chatbot Gemini] Conexão bem-sucedida usando o modelo: ${model}!`);
      return text.trim();

    } catch (err: any) {
      console.warn(`⚠️ Modelo ${model} indisponível ou não suportado:`, err.message || err);
      lastError = err;
    }
  }

  // Se todos falharem, estoura o último erro
  throw lastError || new Error("Nenhum modelo do Gemini respondeu com sucesso.");
}
