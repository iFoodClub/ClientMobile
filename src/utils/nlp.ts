/**
 * Utilitário de Processamento de Linguagem Natural (PLN) para o Chatbot do iFoodClub.
 * Implementa Vetorização TF-IDF e Classificação SVM (One-vs-All) em TypeScript puro.
 * Funciona de forma 100% autônoma no frontend da aplicação móvel.
 */

// Interface para representar os exemplos de treinamento
interface TrainingSample {
  text: string;
  category: string;
}

// Estrutura para ações nativas mapeadas no app
export interface ChatbotAction {
  type: "navigate" | "logout";
  payload?: string;
}

export interface ChatbotResponse {
  category: string;
  answer: string;
  confidence: number;
  action?: ChatbotAction;
}

// Tokenizador básico em português
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    // Remove pontuação comum, mantém acentos em português e caracteres alfanuméricos
    .replace(/[^\w\s\u00C0-\u00FF-]/g, " ")
    .split(/\s+/)
    // Filtra palavras vazias ou caracteres isolados irrelevantes
    .filter((word) => word.trim().length > 1);
}

// Lista básica de Stopwords em português para filtrar palavras de baixa importância
const STOPWORDS = new Set([
  "a", "o", "as", "os", "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
  "um", "uma", "uns", "umas", "com", "para", "por", "que", "se", "ou", "e", "para", "sua",
  "seu", "seus", "suas", "meu", "minha", "meus", "minhas", "este", "esta", "estes", "estas",
  "com", "sobre", "como", "esta", "estamos"
]);

export function filterStopwords(tokens: string[]): string[] {
  return tokens.filter((token) => !STOPWORDS.has(token));
}

export class TfidfVectorizer {
  private vocabulary: string[] = [];
  private idfs: { [word: string]: number } = {};
  private termIndexMap: { [word: string]: number } = {};

  /**
   * Constrói o vocabulário e calcula os valores IDF com base no corpus de treinamento.
   */
  public fit(documents: string[]): void {
    const docTokens = documents.map((doc) => {
      // Tokeniza e remove stopwords para treinar com palavras mais significativas
      return filterStopwords(tokenize(doc));
    });

    const N = documents.length;
    const documentFrequencies: { [word: string]: number } = {};

    // Conta a frequência de documentos contendo cada palavra
    docTokens.forEach((tokens) => {
      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach((token) => {
        documentFrequencies[token] = (documentFrequencies[token] || 0) + 1;
      });
    });

    // Constrói o vocabulário único
    this.vocabulary = Object.keys(documentFrequencies);
    this.termIndexMap = {};
    this.vocabulary.forEach((word, idx) => {
      this.termIndexMap[word] = idx;
    });

    // Calcula o IDF de cada termo usando a fórmula suavizada do scikit-learn
    // idf(t) = ln((1 + N) / (1 + df(t))) + 1
    this.idfs = {};
    this.vocabulary.forEach((word) => {
      const df = documentFrequencies[word] || 0;
      this.idfs[word] = Math.log((1 + N) / (1 + df)) + 1;
    });
  }

  /**
   * Transforma um texto em um vetor numérico TF-IDF com normalização L2.
   */
  public transform(text: string): number[] {
    const tokens = filterStopwords(tokenize(text));
    const vector = new Array(this.vocabulary.length).fill(0);

    if (tokens.length === 0) return vector;

    // Calcula frequências locais dos termos (TF)
    const termCounts: { [word: string]: number } = {};
    tokens.forEach((token) => {
      termCounts[token] = (termCounts[token] || 0) + 1;
    });

    const totalTerms = tokens.length;

    // Multiplica TF por IDF para cada termo no vocabulário
    this.vocabulary.forEach((word, idx) => {
      const tf = (termCounts[word] || 0) / totalTerms;
      const idf = this.idfs[word] || 0;
      vector[idx] = tf * idf;
    });

    // Normalização L2 para tornar o classificador imune ao tamanho do texto
    let sumSquares = 0;
    for (let i = 0; i < vector.length; i++) {
      sumSquares += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSquares);

    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }

  public getVocabularySize(): number {
    return this.vocabulary.length;
  }
}

/**
 * Classificador SVM linear multiclasse implementado via One-vs-All (OvA)
 * O treinamento é otimizado através de SGD Primal (Stochastic Gradient Descent).
 */
export class MulticlassSVM {
  private classifiers: { [category: string]: { w: number[]; b: number } } = {};
  private categories: string[] = [];

  constructor(categories: string[]) {
    this.categories = categories;
  }

  /**
   * Treina os classificadores binários SVM (um para cada categoria).
   * SGD Primal com regularização L2 e perda Hinge.
   */
  public fit(X: number[][], y: string[], vocabSize: number): void {
    const epochs = 180;
    const initialEta = 0.1; // taxa de aprendizado
    const lambda = 0.005;  // termo de regularização L2 (C alto)

    this.classifiers = {};

    this.categories.forEach((category) => {
      // Vetor de pesos inicializado em zero e bias zerado
      const w = new Array(vocabSize).fill(0);
      let b = 0;

      // Executa o treinamento por épocas via subgradiente SGD
      for (let epoch = 0; epoch < epochs; epoch++) {
        // Decaimento sutil da taxa de aprendizado
        const eta = initialEta / (1 + 0.01 * epoch);

        // Embaralha os índices a cada época para estabilizar o SGD
        const indices = Array.from({ length: X.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Atualização de pesos para cada amostra
        for (let i = 0; i < indices.length; i++) {
          const idx = indices[i];
          const xSample = X[idx];
          // Rótulo binário: +1 se for da categoria alvo, -1 caso contrário
          const yBinary = y[idx] === category ? 1 : -1;

          // Computa w * x + b (margem funcional da predição)
          let dotProduct = 0;
          for (let f = 0; f < vocabSize; f++) {
            dotProduct += w[f] * xSample[f];
          }
          const margin = yBinary * (dotProduct + b);

          if (margin < 1) {
            // Gradiente com violação de margem (Hinge loss ativa)
            for (let f = 0; f < vocabSize; f++) {
              w[f] = (1 - eta * lambda) * w[f] + eta * yBinary * xSample[f];
            }
            b = b + eta * yBinary;
          } else {
            // Apenas decaimento do regularizador
            for (let f = 0; f < vocabSize; f++) {
              w[f] = (1 - eta * lambda) * w[f];
            }
          }
        }
      }

      this.classifiers[category] = { w, b };
    });
  }

  /**
   * Classifica um vetor e retorna os escores (margens) para todas as categorias.
   */
  public predict(x: number[]): { [category: string]: number } {
    const scores: { [category: string]: number } = {};

    this.categories.forEach((category) => {
      const classifier = this.classifiers[category];
      if (!classifier) {
        scores[category] = -100;
        return;
      }

      const { w, b } = classifier;
      let score = b;
      for (let i = 0; i < x.length; i++) {
        score += w[i] * x[i];
      }
      scores[category] = score;
    });

    return scores;
  }
}

// ==========================================
// Base de Conhecimento e Corpus de Treinamento
// ==========================================

const TRAINING_CORPUS: TrainingSample[] = [
  // 1. PEDIDOS
  { text: "onde esta o meu pedido", category: "pedidos" },
  { text: "como vejo os meus pedidos", category: "pedidos" },
  { text: "meu pedido esta atrasado", category: "pedidos" },
  { text: "quais pedidos eu fiz hoje", category: "pedidos" },
  { text: "quero ver meus pedidos finalizados", category: "pedidos" },
  { text: "acompanhar status do pedido", category: "pedidos" },
  { text: "quanto tempo falta para o pedido chegar", category: "pedidos" },
  { text: "meu pedido nao chegou", category: "pedidos" },
  { text: "onde vejo o status da entrega", category: "pedidos" },
  { text: "ver o andamento do meu almoco", category: "pedidos" },
  { text: "onde esta minha comida", category: "pedidos" },
  { text: "acompanhar meu pedido", category: "pedidos" },
  { text: "quero ver a entrega", category: "pedidos" },
  { text: "status do pedido", category: "pedidos" },
  { text: "pedido com atraso", category: "pedidos" },
  { text: "meu prato esta demorando", category: "pedidos" },
  { text: "onde vejo minha comida", category: "pedidos" },
  { text: "pedidos de hoje", category: "pedidos" },
  { text: "lista de pedidos", category: "pedidos" },
  { text: "onde fica a tela de pedidos", category: "pedidos" },
  { text: "como abrir meus pedidos", category: "pedidos" },
  { text: "meu almoco esta atrasado", category: "pedidos" },
  { text: "abrir pedidos", category: "pedidos" },
  { text: "tela de pedidos", category: "pedidos" },

  // 2. CANCELAMENTO
  { text: "como cancelo um pedido", category: "cancelamento" },
  { text: "quero cancelar minha compra", category: "cancelamento" },
  { text: "posso cancelar meu pedido de hoje", category: "cancelamento" },
  { text: "regras para cancelamento de pedidos", category: "cancelamento" },
  { text: "devolucao de dinheiro se eu cancelar", category: "cancelamento" },
  { text: "cancelei meu pedido e agora", category: "cancelamento" },
  { text: "estorno de cancelamento", category: "cancelamento" },
  { text: "como peco reembolso de pedido cancelado", category: "cancelamento" },
  { text: "tive que cancelar meu pedido", category: "cancelamento" },
  { text: "cancelamento de pedido", category: "cancelamento" },
  { text: "quero o meu dinheiro de volta", category: "cancelamento" },
  { text: "reembolso do pedido cancelado", category: "cancelamento" },
  { text: "desistir do pedido", category: "cancelamento" },
  { text: "como desfazer a compra do almoco", category: "cancelamento" },

  // 3. RESTAURANTES
  { text: "quais restaurantes estao disponiveis", category: "restaurantes" },
  { text: "como escolho um restaurante parceiro", category: "restaurantes" },
  { text: "ver a lista de restaurantes", category: "restaurantes" },
  { text: "restaurantes aceitos pela empresa", category: "restaurantes" },
  { text: "qual o restaurante do dia", category: "restaurantes" },
  { text: "selecionar restaurante para trabalhar", category: "restaurantes" },
  { text: "buscar novos restaurantes", category: "restaurantes" },
  { text: "como mudar o restaurante escolhido", category: "restaurantes" },
  { text: "quais sao as opcoes de restaurantes", category: "restaurantes" },
  { text: "restaurantes cadastrados no app", category: "restaurantes" },
  { text: "ver parceiros de comida", category: "restaurantes" },
  { text: "qual restaurante podemos pedir hoje", category: "restaurantes" },
  { text: "mudar de restaurante", category: "restaurantes" },
  { text: "escolha do restaurante", category: "restaurantes" },
  { text: "mudar restaurante parceiro", category: "restaurantes" },
  { text: "qual restaurante escolher", category: "restaurantes" },
  { text: "ver a lista de parceiros", category: "restaurantes" },
  { text: "mudar de restaurante para almoco", category: "restaurantes" },
  { text: "onde seleciono o restaurante", category: "restaurantes" },
  { text: "abrir home", category: "restaurantes" },
  { text: "ir para home", category: "restaurantes" },

  // 4. CARDÁPIO
  { text: "ver os pratos de hoje", category: "cardápio" },
  { text: "qual o cardapio do restaurante", category: "cardápio" },
  { text: "quais pratos estao disponiveis", category: "cardápio" },
  { text: "ver menu do dia", category: "cardápio" },
  { text: "quero olhar a lista de pratos", category: "cardápio" },
  { text: "este prato contem gluten", category: "cardápio" },
  { text: "adicionar prato ao cardapio", category: "cardápio" },
  { text: "quero ver a comida de hoje", category: "cardápio" },
  { text: "opcoes de prato para almoco", category: "cardápio" },
  { text: "cardapio do dia", category: "cardápio" },
  { text: "menu do dia", category: "cardápio" },
  { text: "lista de pratos disponiveis", category: "cardápio" },
  { text: "prato principal de hoje", category: "cardápio" },
  { text: "quais comidas tem no menu", category: "cardápio" },
  { text: "ingredientes do prato", category: "cardápio" },
  { text: "ver comida de hoje", category: "cardápio" },
  { text: "abrir o cardapio", category: "cardápio" },
  { text: "ver pratos disponiveis", category: "cardápio" },
  { text: "aba de pratos", category: "cardápio" },
  { text: "ir para pratos", category: "cardápio" },

  // 5. FUNCIONÁRIOS
  { text: "como cadastrar funcionarios", category: "funcionários" },
  { text: "gerenciar colaboradores da empresa", category: "funcionários" },
  { text: "remover um funcionario", category: "funcionários" },
  { text: "adicionar novo trabalhador na lista", category: "funcionários" },
  { text: "CRUD de funcionarios", category: "funcionários" },
  { text: "editar dados de funcionario", category: "funcionários" },
  { text: "listar funcionarios ativos", category: "funcionários" },
  { text: "como dar acesso para colaborador", category: "funcionários" },
  { text: "cadastro de equipe", category: "funcionários" },
  { text: "gerir funcionarios", category: "funcionários" },
  { text: "excluir conta de funcionario", category: "funcionários" },
  { text: "adicionar funcionario", category: "funcionários" },
  { text: "contratar colaboradores no app", category: "funcionários" },
  { text: "novo funcionario cadastrado", category: "funcionários" },
  { text: "lista de colaboradores", category: "funcionários" },
  { text: "cadastrar minha equipe", category: "funcionários" },
  { text: "remover trabalhador", category: "funcionários" },
  { text: "gerenciar equipe", category: "funcionários" },
  { text: "adicionar um novo funcionario", category: "funcionários" },
  { text: "ir para funcionarios", category: "funcionários" },

  // 6. CONTA/SENHA
  { text: "esqueci minha senha", category: "conta/senha" },
  { text: "como altero minha senha", category: "conta/senha" },
  { text: "mudar informacoes do meu perfil", category: "conta/senha" },
  { text: "editar email da minha conta", category: "conta/senha" },
  { text: "recuperar acesso da conta", category: "conta/senha" },
  { text: "alterar cadastro", category: "conta/senha" },
  { text: "atualizar meus dados", category: "conta/senha" },
  { text: "como mudar minha foto de perfil", category: "conta/senha" },
  { text: "esqueci a senha de acesso", category: "conta/senha" },
  { text: "trocar senha", category: "conta/senha" },
  { text: "alterar dados cadastrais", category: "conta/senha" },
  { text: "mudar meu email ou telefone", category: "conta/senha" },
  { text: "resetar senha", category: "conta/senha" },
  { text: "modificar dados da conta", category: "conta/senha" },
  { text: "mudar minha senha", category: "conta/senha" },
  { text: "atualizar meus dados", category: "conta/senha" },
  { text: "trocar e-mail", category: "conta/senha" },
  { text: "alterar cadastro de perfil", category: "conta/senha" },
  { text: "esqueci a senha da conta", category: "conta/senha" },
  { text: "ir para perfil", category: "conta/senha" },
  { text: "abrir configuracoes da conta", category: "conta/senha" },

  // 7. SUPORTE
  { text: "preciso de ajuda", category: "suporte" },
  { text: "falar com o suporte tecnico", category: "suporte" },
  { text: "como funciona o aplicativo", category: "suporte" },
  { text: "ajuda com problemas no app", category: "suporte" },
  { text: "atendimento ao cliente", category: "suporte" },
  { text: "contato com o suporte", category: "suporte" },
  { text: "ajuda sobre o ifoodclub", category: "suporte" },
  { text: "falar com atendente humano", category: "suporte" },
  { text: "suporte do ifoodclub", category: "suporte" },
  { text: "email de contato do suporte", category: "suporte" },
  { text: "telefone de atendimento", category: "suporte" },
  { text: "abrir chamado de suporte", category: "suporte" },
  { text: "app com erro ou travando", category: "suporte" },
  { text: "suporte técnico de TI", category: "suporte" },

  // 8. SAUDAÇÃO
  { text: "oi", category: "saudacao" },
  { text: "ola", category: "saudacao" },
  { text: "bom dia", category: "saudacao" },
  { text: "boa tarde", category: "saudacao" },
  { text: "boa noite", category: "saudacao" },
  { text: "ola assistente", category: "saudacao" },
  { text: "e ai tudo bem", category: "saudacao" },
  { text: "oi tudo bem", category: "saudacao" },
  { text: "oi chatbot", category: "saudacao" },
  { text: "o que voce pode fazer", category: "saudacao" },
  { text: "oi quem e voce", category: "saudacao" },

  // 9. LOGOUT (Ação Nativa Inteligente)
  { text: "quero deslogar", category: "logout" },
  { text: "sair da minha conta", category: "logout" },
  { text: "fazer logoff", category: "logout" },
  { text: "quero sair", category: "logout" },
  { text: "desconectar perfil", category: "logout" },
  { text: "deslogar do ifoodclub", category: "logout" },
  { text: "como faco para sair", category: "logout" },
  { text: "sair do aplicativo", category: "logout" },
  { text: "desconectar da minha conta", category: "logout" },
  { text: "encerrar sessao", category: "logout" },
  { text: "fazer logout", category: "logout" },
  { text: "desconectar do app", category: "logout" },
  { text: "deslogar", category: "logout" }
];

const ANSWERS: { [category: string]: string } = {
  pedidos:
    "Sem problemas! Estou te redirecionando para a aba **Pedidos** agora mesmo. Lá você poderá acompanhar o andamento da sua entrega em tempo real! 📦",
  cancelamento:
    "Você pode solicitar o cancelamento de um pedido diretamente na tela de detalhes dele em até 5 minutos após a confirmação. Após esse prazo, entre em contato direto com o suporte ou com o restaurante.",
  restaurantes:
    "Entendido! Estou abrindo a aba **Início** para você visualizar todos os restaurantes parceiros e selecionar o seu favorito! 🏪",
  cardápio:
    "Com certeza! Estou te levando para a aba **Pratos** para você conferir todas as deliciosas opções de refeições de hoje! 🍽️",
  funcionários:
    "Perfeito! Redirecionando você para a aba **Funcionários** para você gerenciar, cadastrar ou editar os colaboradores da sua empresa. 👥",
  "conta/senha":
    "Claro! Estou te levando para a aba de **Perfil** para você poder atualizar seus dados cadastrais, alterar sua senha ou editar sua foto de perfil. 🔑",
  suporte:
    "Precisa de ajuda com outra coisa? Nosso suporte está disponível de segunda a sexta, das 8h às 18h. Você pode falar conosco pelo e-mail suporte@ifoodclub.com.br ou pelo telefone (11) 99999-9999.",
  saudacao:
    "Olá! Sou o assistente virtual do iFoodClub. Como posso te ajudar hoje? Posso tirar dúvidas sobre pedidos, cancelamentos, restaurantes, cardápio, funcionários, conta ou dar suporte geral. 😊",
  logout:
    "Você tem certeza que deseja sair e encerrar a sua sessão no iFoodClub? 🚪",
  fallback:
    "Desculpe, não consegui compreender sua dúvida com certeza. 😕 Poderia reformular a pergunta? Se preferir, digite 'suporte' para ver nossos canais de atendimento."
};

// Mapeamento de intenções para ações nativas correspondentes
const ACTIONS: { [category: string]: ChatbotAction } = {
  pedidos: { type: "navigate", payload: "/orders" },
  restaurantes: { type: "navigate", payload: "/index" },
  cardápio: { type: "navigate", payload: "/dishes" },
  funcionários: { type: "navigate", payload: "/employees" },
  "conta/senha": { type: "navigate", payload: "/settings" },
  logout: { type: "logout" }
};

/**
 * Motor Principal do Chatbot.
 * Orquestra a vetorização TF-IDF, predição SVM e formatação de respostas.
 */
export class ChatbotService {
  private vectorizer: TfidfVectorizer;
  private svm: MulticlassSVM;
  private isTrained = false;
  private confidenceThreshold = 0.15; // Limiar de confiança para acionar resposta padrão

  constructor() {
    const categories = [
      "pedidos",
      "cancelamento",
      "restaurantes",
      "cardápio",
      "funcionários",
      "conta/senha",
      "suporte",
      "saudacao",
      "logout"
    ];
    this.vectorizer = new TfidfVectorizer();
    this.svm = new MulticlassSVM(categories);
  }

  /**
   * Treina o modelo usando o corpus estático embutido.
   * Roda instantaneamente no cliente (<5ms).
   */
  public train(): void {
    if (this.isTrained) return;

    const startTime = Date.now();

    // 1. Extrai os textos do corpus e ajusta o Vetorizador TF-IDF
    const docTexts = TRAINING_CORPUS.map((sample) => sample.text);
    this.vectorizer.fit(docTexts);

    // 2. Transforma cada texto do corpus em vetor numérico
    const X = docTexts.map((text) => this.vectorizer.transform(text));
    const y = TRAINING_CORPUS.map((sample) => sample.category);

    // 3. Treina o classificador SVM linear One-vs-All
    const vocabSize = this.vectorizer.getVocabularySize();
    this.svm.fit(X, y, vocabSize);

    this.isTrained = true;
    const duration = Date.now() - startTime;
    console.log(`🤖 [Chatbot NLP] Treinado com sucesso! Vocabulário: ${vocabSize} termos | Tempo: ${duration}ms.`);

    // 4. Mede a acurácia de treinamento para validação
    let correct = 0;
    TRAINING_CORPUS.forEach((sample) => {
      // Vetoriza localmente para evitar chamadas de query recursivas ou erros de estado
      const x = this.vectorizer.transform(sample.text);
      const scores = this.svm.predict(x);
      let bestCategory = "fallback";
      let maxScore = -Infinity;
      Object.keys(scores).forEach((category) => {
        const score = scores[category];
        if (score > maxScore) {
          maxScore = score;
          bestCategory = category;
        }
      });
      if (maxScore >= this.confidenceThreshold && bestCategory === sample.category) {
        correct++;
      }
    });
    const accuracy = (correct / TRAINING_CORPUS.length) * 100;
    console.log(`🤖 [Chatbot NLP] Acurácia no conjunto de treinamento: ${accuracy.toFixed(1)}% (${correct}/${TRAINING_CORPUS.length})`);
  }

  /**
   * Processa a mensagem do usuário e devolve a resposta classificada e a intenção predita com ação associada.
   */
  public query(text: string): ChatbotResponse {
    // Garante que o modelo está treinado
    this.train();

    // Se o texto for vazio, devolve fallback
    if (!text || text.trim() === "") {
      return {
        category: "fallback",
        answer: ANSWERS.fallback,
        confidence: 0
      };
    }

    // 1. Transforma o texto em vetor TF-IDF
    const x = this.vectorizer.transform(text);

    // 2. Classifica usando a predição multiclasse SVM
    const scores = this.svm.predict(x);

    // 3. Identifica a categoria com maior pontuação (margem funcional máxima)
    let bestCategory = "fallback";
    let maxScore = -Infinity;

    Object.keys(scores).forEach((category) => {
      const score = scores[category];
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    });

    console.log(`🤖 [Chatbot NLP] Predição: "${text}" -> Categoria: "${bestCategory}" | Score: ${maxScore.toFixed(3)}`);

    // 4. Se a melhor pontuação for menor que o limiar de confiança, ativa o fallback
    if (maxScore < this.confidenceThreshold) {
      return {
        category: "fallback",
        answer: ANSWERS.fallback,
        confidence: maxScore
      };
    }

    // Retorna a resposta completa com a ação mapeada se aplicável
    const action = ACTIONS[bestCategory] || undefined;
    return {
      category: bestCategory,
      answer: ANSWERS[bestCategory] || ANSWERS.fallback,
      confidence: maxScore,
      action
    };
  }
}

// Exporta instância única compartilhada na aplicação para evitar retrabalho de treinamento
export const chatbotService = new ChatbotService();
