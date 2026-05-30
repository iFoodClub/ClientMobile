# 🤖 Guia Rápido: iFoodClub Chatbot

Resumo de todas as capacidades cognitivas, integrações e ações nativas do Assistente de IA.

---

## 🧠 1. Motor de Linguagem Natural (PLN)
* **Fuzzy Match (Levenshtein):** Corrige e interpreta palavras com erros de digitação (ex: *"restorante"* ➡️ *"restaurante"*).
* **Stemmer em Português:** Radicaliza plurais (`-s`, `-oes` ➡️ `-ao`) e sufixos verbais (`-ar`, `-ei`, `-ou`, `-amento`), tratando *"cancelei"*, *"cancelou"* ou *"cancelar"* com a mesma intenção.
* **Classificação SVM (SGD):** Identificação matemática rápida (<1ms) da categoria do usuário.

---

## 🔌 2. Integrações de API em Tempo Real (Real-Time)
O chatbot consome dados reais da aplicação e responde inline, cancelando a navegação automática para garantir a melhor experiência:

* **🏪 Restaurantes Cadastrados (`/index`):** Busca as opções da região (`RestaurantRepository.fetchRestaurants()`) listando nome, média de estrelas (⭐) e total de pratos.
* **🍽️ Cardápio e Pratos (`/dishes`):** Busca os pratos do restaurante parceiro da empresa (`DishRepository.fetchDishesByRestaurantId()`) com nome, preço (R$) e descrição.
* **📅 Pedidos Pessoais (`/orders`):** Lista o cronograma semanal de almoços agendados pelo colaborador (`OrderRepository.getEmployeeWeeklyChosenOrders()`).
* **🟢 Pedidos da Equipe/Empresa:** Mapeia quais membros da equipe já programaram o pedido de hoje (`CompanyRepository.getEmployeesWeeklyOrdersCurrentDay()`), mostrando pratos e status.
* **👥 Lista de Funcionários (`/employees`):** Varre a equipe cadastrada (`CompanyRepository.getEmployeeByCompanyId()`) indicando status de férias (🏖️).

---

## 🚀 3. Ações Nativas & UX (AI Agent)
* **Smart Redirection (Fallback):** Se a busca na API falhar ou estiver offline, o chat fecha automaticamente após um timer de **1.5s** e redireciona para a respectiva aba (`/(tabs)`, `/(tabs)/dishes`, `/(tabs)/orders`, etc.).
* **Foco no Chat (UX Otimizada):** Se a API responder com sucesso, a navegação automática é cancelada (`botMessage.action = undefined`) mantendo o chat aberto para leitura confortável.
* **Interactive Logout:** Intent de logout exibe botões personalizados de **"Sim, Sair"** e **"Não, Cancelar"** no balão. Pressionar sim limpa a sessão com segurança (`useAuthStore.logout()`) e redireciona à tela de login (`/sign-in`).
* **Microfone & Voz:** Botão de voz (`[US56]`) preparado com tratamento de erro e fallbacks integrados, permitindo testes limpos no Expo Go sem crashes nativos.
