# FoodClub - Mobile Client 📱

O **FoodClub** é um aplicativo mobile desenvolvido para facilitar a gestão de refeições corporativas. Através dele, funcionários de empresas parceiras podem realizar pedidos diários de restaurantes selecionados, aproveitando descontos exclusivos gerados pelo volume de pedidos da equipe.

## 🚀 Objetivo do Aplicativo
Oferecer uma interface intuitiva para que o funcionário possa gerenciar sua alimentação semanal, garantindo preços mais acessíveis e praticidade no dia a dia da empresa.

---

## 👥 Perfis de Usuário e Funcionalidades

O aplicativo adapta sua interface e funcionalidades com base no perfil do usuário logado:

### 1. Perfil: Funcionário (Usuário Final)
O foco é a praticidade na escolha da refeição. O funcionário não tem acesso a preços ou informações financeiras, funcionando como um cardápio digital da "cozinha" da empresa.
- **Painel do Dia:** Visualização do cardápio do restaurante que a empresa escolheu para hoje.
- **Montagem do Pedido:** 
    - Seleção de Marmita, Sobremesa e/ou Suco.
    - **Regra de Validação:** Pelo menos um item deve ser selecionado.
    - **UX Alert:** Caso o usuário selecione apenas sobremesa ou suco (sem marmita), um modal de confirmação será exibido para evitar erros de pedido.
- **Agendamento Semanal:** Interface para definir as escolhas de segunda a sexta-feira de uma só vez.
- **Centro de Notificações:** 
    - Alertas sobre troca de restaurante parceiro pela empresa.
    - Lembretes para fechamento de pedidos.
    - Boas-vindas para novos usuários.

### 2. Perfil: Empresa (RH / Gestor)
O foco é a gestão da parceria e o controle financeiro centralizado. Toda a conta é paga pela empresa, sem transações financeiras para o funcionário.
- **Seleção de Parceiro:** Dashboard para escolher qual restaurante será o parceiro do dia/semana.
- **Dashboard Financeiro em Tempo Real:** 
    - **Monitoramento de Pedidos:** Lista consolidada de quem já pediu e o que foi pedido.
    - **Controle de Gastos:** Visualização do valor total bruto (sem desconto) vs. valor líquido (com o desconto progressivo aplicado).
    - **Métrica de Economia:** Indicador de "Economia Gerada" (Diferença entre o valor original e o valor com desconto do FoodClub).
- **Gestão de Funcionários:** Visualização e controle da lista de funcionários ativos.
- **Centro de Alertas:** Recebe notificações críticas caso o restaurante parceiro atual fique **Indisponível** (exigindo a escolha de um novo parceiro).
- **Gatilho de Notificação:** Ao alterar o parceiro, o sistema dispara automaticamente uma notificação para todos os funcionários revisarem suas escolhas semanais.

### 3. Perfil: Restaurante
O foco é a exposição do cardápio e gestão de grandes volumes de pedidos.
- **Gestão de Cardápio:** Cadastro e edição de pratos categorizados obrigatoriamente como **Principal**, **Sobremesa** ou **Bebida**.
- **Controle de Disponibilidade:** O restaurante pode se marcar como **Disponível** ou **Indisponível** a qualquer momento.
    - **UX Alert:** Caso tente ficar "Indisponível", o app deve exibir um modal de confirmação alertando que todas as empresas que o têm como parceiro atual serão notificadas e a parceria será interrompida para aquele período.
- **Configuração de Agenda:** Definição obrigatória de dias e horários de funcionamento durante o cadastro, editável a qualquer momento nas configurações.
- **Regra de Habilitação:** O restaurante só será listado para as empresas após possuir pelo menos um item ativo em cada uma das três categorias obrigatórias, estar marcado como "Disponível" e possuir a agenda de funcionamento configurada.
- **Configuração de Desconto Progressivo:** Definição das regras de desconto baseadas na quantidade total de pedidos (ex: 10 pedidos = 5% OFF, 20 pedidos = 10% OFF).
- **Dashboard de Performance:** Painel para acompanhar o desempenho de cada prato:
    - **Volume de Vendas:** Quantidade total vendida de cada item.
    - **Análise Financeira:** Cálculo de lucro/prejuízo por prato (com campo opcional para inserção do **Preço de Produção**).
- **Relatório Detalhado por Prato:** Ao selecionar um item, o restaurante acessa:
    - Histórico de desempenho ao longo do tempo.
    - **Feedback Direto:** Visualização de todas as avaliações e comentários enviados pelos funcionários sobre aquele prato específico.
- **Consolidação de Pedidos:** Acesso à lista completa de pedidos por empresa, facilitando a logística de entrega em lotes.

---

## 📌 Notas de Interesse (Ideias Futuras)

Esta seção agrupa funcionalidades planejadas ou ideias que podem ser exploradas no futuro para cada perfil de usuário:

### Para o Funcionário
- **Restrições Alimentares:** Filtros ou avisos automáticos caso um prato contenha alérgenos configurados no perfil (ex: glúten, lactose).
- **Avaliação de Pratos:** Sistema de estrelas e comentários para ajudar o restaurante e a empresa a medirem a qualidade.
- **Favoritos:** Marcar pratos preferidos para facilitar o agendamento semanal.

### Para a Empresa
- **Relatórios Mensais:** Exportação de PDFs com o fechamento de gastos e economia total do mês.
- **Subsídio Parcial:** Possibilidade da empresa pagar uma parte e o funcionário pagar outra (atualmente a empresa paga 100%).
- **Gestão por Departamentos:** Separar os gastos e pedidos por áreas da empresa.

### Para o Restaurante
- **Análise de Demanda:** Gráficos mostrando quais dias da semana possuem maior volume de pedidos.
- **Destaques do Dia:** Possibilidade de promover um prato específico no topo do cardápio para as empresas parceiras.
- **Previsão de Insumos:** Relatório antecipado baseado nos pedidos semanais agendados pelos funcionários.

---

## 🛠 Tech Stack
- **Framework:** [Expo](https://expo.dev/) (React Native)
- **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **Estilização:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
- **Animações:** [Moti](https://moti.fyi/) & [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Consumo de API:** [Axios](https://axios-http.com/)

---

## 📦 Instalação e Execução

1. Acesse a pasta: `cd ClientMobile`
2. Instale as dependências: `npm install`
3. Inicie o projeto: `npx expo start`
