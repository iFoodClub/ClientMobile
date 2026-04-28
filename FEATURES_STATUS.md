# Status das Funcionalidades - FoodClub 🚀

Este documento lista as funcionalidades planejadas para cada perfil de usuário e o seu status atual de implementação no frontend (**ClientMobile**).

---

## 👥 1. Perfil: Funcionário (Usuário Final)

| Funcionalidade | Status | Observações |
| :--- | :--- | :--- |
| **Painel do Dia** | ✅ Feito | Visualização do restaurante parceiro na Home (`app/(tabs)/index.tsx`). |
| **Montagem do Pedido** | ⏳ Pendente | Lógica de seleção de Marmita/Sobremesa/Suco e validações de UX não encontradas. |
| **Agendamento Semanal** | ✅ Feito | Possibilidade de escolher prato para cada dia da semana em `restaurant-details.tsx`. |
| **Centro de Notificações** | ❌ Pendente | Sistema de alertas e lembretes não implementado no front. |

---

## 🏢 2. Perfil: Empresa (RH / Gestor)

| Funcionalidade | Status | Observações |
| :--- | :--- | :--- |
| **Seleção de Parceiro** | ✅ Feito | Funcionalidade implementada na tela de detalhes do restaurante (`restaurant-details.tsx`). |
| **Monitoramento de Pedidos** | ✅ Feito | Dashboard consolidado de quem já pediu em `CompanyOrder.tsx`. |
| **Controle de Gastos / Economia** | ⚠️ Parcial | Lista os pedidos, mas métricas de "Valor Bruto vs Líquido" e "Economia Gerada" não estão visíveis. |
| **Gestão de Funcionários** | ✅ Feito | CRUD completo de funcionários em `app/(tabs)/employees.tsx`. |
| **Centro de Alertas** | ❌ Pendente | Notificações críticas de indisponibilidade do restaurante não implementadas. |
| **Gatilho de Troca** | ❌ Pendente | Notificação automática para funcionários ao trocar de parceiro. |

---

## 🍕 3. Perfil: Restaurante

| Funcionalidade | Status | Observações |
| :--- | :--- | :--- |
| **Gestão de Cardápio** | ⚠️ Parcial | CRUD de pratos funciona (`dishes.tsx`), mas falta campo de **Categorias** (Principal, Sobremesa, Bebida). |
| **Controle de Disponibilidade** | ❌ Pendente | Botão de Disponível/Indisponível e alertas de interrupção de parceria não encontrados. |
| **Configuração de Agenda** | ❌ Pendente | Interface para definir dias e horários de funcionamento não encontrada. |
| **Regra de Habilitação** | ❌ Pendente | Validação de itens ativos por categoria antes de listar para empresas. |
| **Desconto Progressivo** | ❌ Pendente | Configuração das faixas de desconto baseadas no volume de pedidos. |
| **Dashboard de Performance** | ❌ Pendente | Gráficos de volume de vendas e análise financeira (lucro/prejuízo). |
| **Relatório Detalhado / Feedback** | ❌ Pendente | Histórico de desempenho e visualização de comentários por prato. |
| **Consolidação de Pedidos** | ✅ Feito | Acesso à lista completa de pedidos por empresa em `RestaurantOrders.tsx`. |

---

## 🔔 4. Sistema de Notificações (Mapeamento de Gatilhos)

Esta seção mapeia os eventos do sistema que devem disparar notificações para os usuários.

| Gatilho (Evento) | Destinatário | Descrição da Notificação |
| :--- | :--- | :--- |
| **Troca de Restaurante Parceiro** | 👥 Funcionários | Alerta informando que a empresa mudou o parceiro e que os pedidos semanais devem ser revisados/atualizados. |
| **Indisponibilidade do Restaurante** | 🏢 Empresas | Alerta crítico informando que o restaurante parceiro atual ficou **Indisponível**, exigindo a escolha de um novo parceiro. |
| **Fechamento de Pedido Diário** | 👥 Funcionários | Lembrete (Push) caso o funcionário ainda não tenha definido sua escolha para o dia seguinte ou atual. |
| **Novo Colaborador Cadastrado** | 👥 Funcionário | Boas-vindas e instruções para configurar seu primeiro agendamento semanal. |

---

## 🛡️ 5. Verificações e Regras de Consistência (Checklist Anti-Bug)

Regras críticas que devem ser validadas para garantir a integridade dos dados e da experiência do usuário.

| Regra de Negócio | Impacto | Descrição |
| :--- | :--- | :--- |
| **Reset de Pedidos na Troca de Parceiro** | 💣 Crítico | Ao a empresa alterar o restaurante selecionado, **todos os pedidos semanais dos funcionários devem ser zerados**. Isso evita que um funcionário peça um prato de um restaurante que não é mais o parceiro atual. |
| **Mínimo de Itens por Categoria** | 🛑 Bloqueante | O restaurante só pode ser listado se tiver pelo menos 1 Principal, 1 Sobremesa e 1 Bebida ativos. |
| **Validação de Prato Único por Dia** | 🍱 UX | Garantir que o funcionário não consiga agendar mais de uma combinação de pratos para o mesmo dia da semana. |

---

## 🛠 Legenda
- ✅ **Feito**: Funcionalidade implementada e funcional.
- ⚠️ **Parcial**: Funcionalidade iniciada, mas faltam regras de negócio ou campos importantes.
- ⏳ **Em Progresso**: Sinais de implementação encontrados, mas não finalizados.
- ❌ **Pendente**: Funcionalidade ainda não iniciada no frontend.

---

*Última atualização: 28/04/2026*
