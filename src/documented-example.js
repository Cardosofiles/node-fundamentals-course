/**
 * - Crair usuários
 * - Listagem de usuários
 * - Edição de Usuários
 * - Remoção de Usuários
 *
 * - HTTP
 *  - Método
 *  - URL
 *
 * GET, POST, PUT, PATCH, DELETE
 *
 * GET => Bucar um recurso do back-end
 * POST => Criar um recurso no back-end
 * PUT => Atualizar um recurso no back-end
 * PATCH => Atualizar um recurso específico no back-end
 * DELETE => Deletar um recurso no back-end
 *
 * GET / users => Buscando usuários do back-end
 * POST / users => Criar um usuário no back-end
 *
 * Statefull | Stateless
 *
 * Statefull
 * - Definição: Uma aplicação é stateful quando mantém informações (estado) entre
 * diferentes requisições ou interações do usuário.
 * - Exemplo: Imagine um carrinho de compras em um e-commerce. A aplicação lembra
 * os itens adicionados ao carrinho enquanto você navega por diferentes páginas.
 * - Implementação: O estado geralmente é armazenado no servidor ou em alguma camada intermediária.
 * - Desafios:
 *  Necessita de mais recursos no servidor para armazenar o estado de múltiplos usuários.
 *  Se o servidor cair, o estado pode ser perdido.
 *  Escalabilidade pode ser mais complicada, pois o estado deve ser sincronizado entre servidores.
 *
 * Stateless
 * - Definição: Uma aplicação é stateless quando não mantém nenhuma informação
 * entre as requisições. Cada requisição é tratada de forma independente.
 * - Exemplo: Uma API RESTful onde cada requisição inclui todas as informações
 * necessárias, como autenticação (via token) e dados da operação.
 * - Implementação: A aplicação não precisa armazenar o estado; os clientes
 * enviam os dados necessários em cada interação.
 * Vantagens:
 *  Melhor escalabilidade, já que os servidores não precisam sincronizar estados.
 *  Resiliência: a perda de um servidor não afeta o fluxo.
 * Desafios:
 *  O cliente precisa enviar mais informações em cada requisição, aumentando a sobrecarga de dados.
 *
 * JSON - JavaScript Object Notation
 * Cabeçalhos (Request/Response) => Metadados
 */

// Importa o módulo HTTP do Node.js para criar o servidor.
import http from "node:http";

// Array que armazenará os usuários criados no sistema.
const users = [];

// Criação do servidor HTTP utilizando o método `createServer`.
const server = http.createServer((req, res) => {
  // Desestruturação do objeto `req` para obter o método HTTP e a URL da requisição.
  const { method, url } = req;

  // Verifica se a requisição é um GET na rota "/users".
  if (method === "GET" && url === "/users") {
    // Define o cabeçalho da resposta para indicar que o conteúdo retornado será JSON.
    res.setHeader("Content-type", "application/json");
    // Converte o array `users` para uma string JSON e encerra a resposta com o conteúdo.
    return res.end(JSON.stringify(users));
  }

  // Verifica se a requisição é um POST na rota "/users".
  if (method === "POST" && url === "/users") {
    // Adiciona um novo objeto ao array `users`. Este é um exemplo fixo para demonstração.
    users.push({
      id: 1, // ID fixo do usuário (em um caso real, seria gerado dinamicamente).
      name: "John Doe", // Nome fixo do usuário.
      email: "johndoe@example.com", // Email fixo do usuário.
    });

    // Exibe o array `users` atualizado no console, útil para debug.
    console.log(users);

    // Retorna uma mensagem de confirmação de que o usuário foi criado.
    return res.end("Criando um novo usuário");
  }

  // Resposta padrão para todas as outras rotas ou métodos HTTP não implementados.
  return res.end("hello Javascript and TypeScript");
});

// Inicia o servidor e o configura para escutar conexões na porta 3333.
// O método `listen` aceita:
// - Um número de porta (obrigatório).
// - Um callback opcional que é executado quando o servidor começa a rodar.
server.listen(3333, () => {
  // Exibe uma mensagem no console informando que o servidor está ativo.
  console.log("Server is running on port 3333");
});

/**
 * MÉTODOS UTILIZADOS:
 *
 * 1. http.createServer(callback):
 *    - Cria um servidor HTTP.
 *    - `callback(req, res)`:
 *      - `req` (Request): Objeto que contém informações sobre a requisição HTTP.
 *      - `res` (Response): Objeto usado para configurar e enviar respostas ao cliente.
 *
 * 2. res.setHeader(name, value):
 *    - Configura cabeçalhos HTTP na resposta.
 *    - Exemplo: `Content-Type` define o tipo de conteúdo retornado, como "application/json".
 *
 * 3. JSON.stringify(value):
 *    - Converte valores JavaScript (objetos, arrays, etc.) em strings no formato JSON.
 *    - Necessário para enviar dados estruturados na resposta HTTP.
 *
 * 4. res.end([data]):
 *    - Finaliza a resposta HTTP e envia o conteúdo opcional ao cliente.
 *    - O parâmetro `data` pode ser uma string, buffer ou JSON convertido em string.
 *
 * 5. server.listen(port, [callback]):
 *    - Faz o servidor escutar requisições em uma porta específica.
 *    - `port`: Número da porta (exemplo: 3333).
 *    - `callback`: Função opcional executada quando o servidor é iniciado.
 *
 * FLUXO GERAL DO CÓDIGO:
 * - Quando o servidor recebe uma requisição, verifica:
 *   1. Se é um GET em "/users", retorna todos os usuários no formato JSON.
 *   2. Se é um POST em "/users", adiciona um usuário fixo ao array `users`.
 *   3. Para outros casos, retorna uma mensagem padrão.
 * - O servidor escuta na porta 3333 e está pronto para atender conexões.
 */
