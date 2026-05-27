import { create } from "zustand";
import { chatbotService } from "../utils/nlp";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface IChatStore {
  messages: Message[];
  isModalVisible: boolean;
  isTyping: boolean;
  openModal: () => void;
  closeModal: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
}

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "welcome",
  text: "Olá! Sou o assistente virtual do iFoodClub. Como posso te ajudar hoje? 🤖\n\nPosso te ajudar com dúvidas sobre:\n• 📦 **Pedidos** (Status e atrasos)\n• ❌ **Cancelamento** (Requisitos e estornos)\n• 🏪 **Restaurantes** (Onde e como selecionar)\n• 🍽️ **Cardápio** (Pratos e menu do dia)\n• 👥 **Funcionários** (Gerenciamento e CRUD)\n• 🔑 **Conta/Senha** (Perfil e acessos)\n• 💬 **Suporte** (Contato e ajuda geral)",
  sender: "bot",
  timestamp: new Date()
};

export const useChatStore = create<IChatStore>((set, get) => ({
  messages: [INITIAL_WELCOME_MESSAGE],
  isModalVisible: false,
  isTyping: false,

  openModal: () => set({ isModalVisible: true }),

  closeModal: () => set({ isModalVisible: false }),

  sendMessage: async (text: string) => {
    if (!text || text.trim() === "") return;

    // 1. Cria a mensagem do usuário
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date()
    };

    // 2. Atualiza o estado imediatamente com a mensagem do usuário e ativa o indicador de digitação
    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true
    }));

    // 3. Simula digitação sutil para uma experiência natural e premium
    await new Promise((resolve) => setTimeout(resolve, 750));

    try {
      // 4. Executa a inteligência de PLN (TF-IDF + SVM) no frontend
      const prediction = chatbotService.query(text);

      // 5. Cria a mensagem de resposta do bot
      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: prediction.answer,
        sender: "bot",
        timestamp: new Date()
      };

      // 6. Atualiza o estado com a resposta e remove o indicador de digitação
      set((state) => ({
        messages: [...state.messages, botMessage],
        isTyping: false
      }));
    } catch (error) {
      console.error("❌ Erro ao processar mensagem do chatbot:", error);

      // Fallback em caso de falha catastrófica inesperada
      const fallbackMessage: Message = {
        id: `bot-err-${Date.now()}`,
        text: "Desculpe, ocorreu um erro interno ao processar sua pergunta. Por favor, tente novamente ou digite 'suporte'.",
        sender: "bot",
        timestamp: new Date()
      };

      set((state) => ({
        messages: [...state.messages, fallbackMessage],
        isTyping: false
      }));
    }
  },

  clearHistory: () => set({ messages: [INITIAL_WELCOME_MESSAGE], isTyping: false })
}));
