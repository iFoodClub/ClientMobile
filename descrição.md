# Funcionalidades foodclub

Esse guia será destinado a listar as funcionalidades do nosso projeto FoodClub, abaixo serão listados os usuários e o que se espera que cada um deles possa fazer.

## Restaurante

- [x] Registrar uma conta do tipo restaurante
- [x] Cadastrar pratos através de um formulário
- [x] Conseguir listar seus pratos cadastrados e poder editar os já existentes
- [x] Visualizar os pedidos feitos
- [ ] Conseguir visualizar as empresas as quais o consideram o restaurante escolhido.
- [ ] Possuir dashboard para visualizar vendas, dias e clientes que mais pediram. 
- [ ] Poder ver as avaliações de seus pratos e as notas atribuídas para eles, podendo responder um comentário (talvez)
- [ ] Trocar suas informações de perfil
- [ ] Configurar política de descontos
    Ex: Acima de 5 pedidos 10% de desconto, acima de 10 % 15% ... algo que será calculado de forma automática quando a empresa realizar seu pedido.

    ### Caso sobre tempo

- [ ]  Estoque de pratos
- [ ]  Poder ter um toggle de marcar prato como disponível ou indisponível, fazendo com que não seja mais possível pedir ele naquele momento.
- [ ] Template de pratos básicos para o restaurante, de forma que ele poderá iniciar já com alguns pratos básicos registrados para ele. 
- [ ] Possibilidade de definir os dias em que cada prato estarão disponíveis, default: todos os dias, podendo ser selecionados com checkboxes


## Empresa

- [x] Criar sua conta do tipo 
- [x] Ter controle do CRUD de funcionário, registrando conta que eles utilizarão para acessoa a plataforma
- [x] Poder visualizar a lista de restaurantes registrados no aplicativo
- [ ] Nos detalhes do restaurante, ver os detalhes a respeito da política de desconto.
- [x] Selecionar um restaurante em específico com o qual deseja trabalhar 
- [ ] Configurar horário para realizar o pedido do dia, de forma com que os funcionários deverão realizar seus pedidos até aquele momento. 
- [ ] Enviar pedido para o restaurante selecionado no horário configurado de forma automática
- [ ] Dashboard para visualizar valores gastos, valor economizado com a política de pedidos em conjunto ex: quantos ganhou de desconto em cada pedido e esse valor somado e mostrado no dashboard
- [x] Poder acompanhar os status de pedido
- [x] Trocar suas informações de perfil

    ### Caso sobre tempo

- [ ] Colocar um funcionário no status por motivos diversos, férias por exemplo em um range de datas ex: 10/02/2026 até 10/03/2026


### Funcionário

- [x] Criar sua conta do tipo
- [x] Visualizar os pratos disponibilizados para ele para que possa fazer seu pedido
- [x] Configurar pedidos semanais dentro dos pratos disponibilizados, ex: segunda feira: file de frango, terça-feira: macarronada, de forma que ao fechar o prazo estabelecido pela empresa para fazer o pedido, caso ele possua a sua lista semanal configurada, ele não precisará se preocupar em pedir novamente
- [ ] Para cada prato que pedir, caso ainda não o tenha feita, poderá deixar uma avaliação e também avaliar o restaurante, quando receber o pedido (pedido finalizado) deve aparecer " deseja avaliar esse prato ? "
- [ ] Sinalizar um dia ao qual não irá trabalhar, dessa forma seu pedido não será realizado. 
- [x] Trocar suas informações de perfil

### Caso sobre tempo

- [ ] Caso o pedido semanal não esteja disponível no dia (pois o restaurante marcou o prato como indisponível) o funcionário deve ser notificado imediatamente para que possa pedir outro prato dentro das opções disponibilizadas.
