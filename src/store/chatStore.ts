import { create } from "zustand";
import { chatbotService, ChatbotAction } from "../utils/nlp";
import RestaurantRepository from "../repository/restaurantRepository";
import OrderRepository from "../repository/orderRepository";
import DishRepository from "../repository/dishRepository";
import CompanyRepository from "../repository/companyRepository";
import { generateGeminiResponse } from "../utils/gemini";
import { useAuthStore } from "./authStore";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  action?: ChatbotAction;
  options?: { label: string; actionType: string }[];
}

interface IChatStore {
  messages: Message[];
  isModalVisible: boolean;
  isTyping: boolean;
  openModal: () => void;
  closeModal: () => void;
  sendMessage: (text: string) => Promise<void>;
  addCustomMessage: (message: Message) => void;
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
        timestamp: new Date(),
        action: prediction.action
      };

      // Se for logout, adiciona botões interativos
      if (prediction.category === "logout") {
        botMessage.options = [
          { label: "Sim, Sair", actionType: "CONFIRM_LOGOUT" },
          { label: "Não, Cancelar", actionType: "CANCEL_LOGOUT" }
        ];
      }

      let fetchedData: any = undefined;

      // 5.1 Busca dinâmica em APIs/Repositories baseada na intenção
      if (prediction.category === "restaurantes") {
        try {
          const response = await RestaurantRepository.fetchRestaurants();
          const list = response.data;
          if (list && list.length > 0) {
            fetchedData = list; // Salva para o Gemini sintetizar!
            let answerText = "Temos excelentes opções registradas no iFoodClub! Veja os restaurantes parceiros disponíveis:\n\n";
            list.slice(0, 5).forEach((rest) => {
              const rating = rest.averageRating ? `⭐ **${rest.averageRating.toFixed(1)}**` : "sem avaliações";
              answerText += `• 🏪 **${rest.name}** - ${rating} (${rest.dishCount || 0} pratos cadastrados)\n`;
            });
            botMessage.text = answerText;
            botMessage.action = undefined; // UX: Responde apenas no chat!
          }
        } catch (err) {
          console.error("Erro ao buscar restaurantes dinamicamente no chatbot:", err);
        }
      } else if (prediction.category === "cardápio") {
        try {
          const { user } = useAuthStore.getState();
          const selectedRestaurantId = user?.employee?.company?.selectedRestaurantId || user?.company?.restaurantId; 
          
          if (selectedRestaurantId) {
            const response = await DishRepository.fetchDishesByRestaurantId(selectedRestaurantId);
            const dishes = response.data;
            if (dishes && dishes.length > 0) {
              fetchedData = dishes; // Salva para o Gemini sintetizar!
              let answerText = `Aqui estão as deliciosas opções de pratos do dia no restaurante parceiro da sua empresa:\n\n`;
              dishes.slice(0, 5).forEach((dish) => {
                answerText += `• 🍽️ **${dish.name}** - R$ ${Number(dish.price).toFixed(2)}\n  _${dish.description || "Sem descrição"}_\n\n`;
              });
              botMessage.text = answerText;
              botMessage.action = undefined; // UX: Responde apenas no chat!
            }
          }
        } catch (err) {
          console.error("Erro ao buscar pratos dinamicamente no chatbot:", err);
        }
      } else if (prediction.category === "pedidos") {
        try {
          const { user } = useAuthStore.getState();
          const lowerText = text.toLowerCase();
          const isCompanyQuery = lowerText.includes("equipe") || lowerText.includes("empresa") || lowerText.includes("quem pediu") || lowerText.includes("todos") || lowerText.includes("colaboradores");
          const companyId = user?.employee?.companyId || user?.company?.id;

          if (isCompanyQuery && companyId) {
            // Consulta pedidos globais da empresa/equipe
            const response = await CompanyRepository.getEmployeesWeeklyOrdersCurrentDay(companyId);
            const data = response.data;
            if (data && data.employees && data.employees.length > 0) {
              fetchedData = data; // Salva para o Gemini sintetizar!
              let answerText = `Aqui está o status dos pedidos de hoje da equipe no restaurante parceiro (**${data.restaurant?.name || "Parceiro da Empresa"}**):\n\n`;
              let hasOrders = false;
              data.employees.forEach((emp) => {
                if (emp.order && emp.order.length > 0) {
                  hasOrders = true;
                  const dishNames = emp.order.map(o => `**${o.name}** (R$ ${Number(o.price).toFixed(2)})`).join(", ");
                  answerText += `• 🟢 **${emp.name}**: ${dishNames}\n`;
                } else {
                  answerText += `• ⚪ **${emp.name}**: Sem pedidos agendados hoje\n`;
                }
              });
              if (!hasOrders) {
                answerText = `Hoje nenhum colaborador da equipe tem pedidos agendados no restaurante parceiro. 🍽️`;
              }
              botMessage.text = answerText;
              botMessage.action = undefined; // UX: Responde apenas no chat!
            } else {
              botMessage.text = "Não encontrei nenhum pedido agendado hoje para a sua empresa. 🍽️";
              botMessage.action = undefined;
            }
          } else if (user?.employee?.id) {
            // Consulta pedidos semanais do colaborador logado
            const response = await OrderRepository.getEmployeeWeeklyChosenOrders(user.employee.id);
            const choices = response.data;
            if (choices && choices.length > 0) {
              fetchedData = choices; // Salva para o Gemini sintetizar!
              const dayNamesPT: Record<string, string> = {
                Monday: "Segunda-feira",
                Tuesday: "Terça-feira",
                Wednesday: "Quarta-feira",
                Thursday: "Quinta-feira",
                Friday: "Sexta-feira",
                Saturday: "Sábado",
                Sunday: "Domingo"
              };
              let answerText = "Identifiquei seus pedidos agendados para esta semana:\n\n";
              choices.forEach((choice) => {
                const dayPT = dayNamesPT[choice.dayOfWeek] || choice.dayOfWeek;
                answerText += `• 📅 **${dayPT}**: **${choice.dish.name}** - R$ ${Number(choice.dish.price).toFixed(2)}\n`;
              });
              botMessage.text = answerText;
              botMessage.action = undefined; // UX: Responde apenas no chat!
            } else {
              botMessage.text = "Você ainda não agendou nenhum pedido para esta semana. 🍽️\n\nQue tal dar uma olhada no menu do dia? Digite 'ver cardápio' para ver as opções! 🚀";
              botMessage.action = undefined;
            }
          }
        } catch (err) {
          console.error("Erro ao buscar pedidos dinamicamente no chatbot:", err);
        }
      } else if (prediction.category === "funcionários") {
        try {
          const { user } = useAuthStore.getState();
          const companyId = user?.employee?.companyId || user?.company?.id;
          if (companyId) {
            const response = await CompanyRepository.getEmployeeByCompanyId(companyId);
            const list = response.data;
            if (list && list.length > 0) {
              fetchedData = list; // Salva para o Gemini sintetizar!
              let answerText = "Encontrei os seguintes colaboradores ativos cadastrados na sua empresa:\n\n";
              list.forEach((emp) => {
                const vacationStatus = emp.vacation ? " 🏖️ *(Em férias)*" : "";
                answerText += `• 👥 **${emp.name}** - ${emp.email}${vacationStatus}\n`;
              });
              botMessage.text = answerText;
              botMessage.action = undefined; // UX: Responde apenas no chat!
            } else {
              botMessage.text = "Sua empresa não possui colaboradores cadastrados ainda. 👥";
              botMessage.action = undefined;
            }
          }
        } catch (err) {
          console.error("Erro ao buscar colaboradores da empresa no chatbot:", err);
        }
      }

      // 5.2 Se a chave do Gemini estiver configurada no .env, realiza a síntese cognitiva híbrida!
      if (process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
        try {
          const isGeneralCategory = ["saudacao", "suporte", "fallback"].includes(prediction.category);
          if (fetchedData || isGeneralCategory) {
            console.log("🤖 [Chatbot Gemini] Iniciando síntese via LLM (gemini-1.5-flash)...");
            const geminiReply = await generateGeminiResponse(text.trim(), fetchedData);
            botMessage.text = geminiReply;
            if (fetchedData) {
              botMessage.action = undefined; // UX: Mantém o chat aberto no sucesso
            }
          }
        } catch (geminiErr) {
          console.warn("⚠️ Falha ou lentidão na API do Gemini. Usando resposta offline local:", geminiErr);
        }
      }

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

  addCustomMessage: (message: Message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  clearHistory: () => set({ messages: [INITIAL_WELCOME_MESSAGE], isTyping: false })
}));
