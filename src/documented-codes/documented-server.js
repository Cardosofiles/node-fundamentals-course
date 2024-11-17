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

// Importa o módulo http nativo do Node.js para criar o servidor
import http from "node:http";

// Array em memória para armazenar os usuários
const users = [];

// Cria o servidor HTTP
const server = http.createServer(async (req, res) => {
  // Extrai o método HTTP (GET, POST, etc.) e a URL da requisição
  const { method, url } = req;

  // Array para armazenar os chunks de dados do corpo da requisição
  const buffers = [];

  // Coleta os dados do corpo da requisição
  for await (const chunk of req) {
    buffers.push(chunk); // Adiciona cada chunk ao array
  }

  // Tenta converter os dados do corpo da requisição para JSON
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString()); // Concatena e converte para string
  } catch {
    req.body = null; // Caso não seja um JSON válido, define como null
  }

  // Rota: Obter a lista de usuários (GET /users)
  if (method === "GET" && url === "/users") {
    // Define o cabeçalho Content-Type para JSON e retorna a lista de usuários
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(users));
  }

  // Rota: Criar um novo usuário (POST /users)
  if (method === "POST" && url === "/users") {
    // Valida se o corpo da requisição contém os campos obrigatórios
    if (!req.body || !req.body.name || !req.body.email) {
      return res
        .writeHead(400) // Define o status HTTP como 400 (Bad Request)
        .end("Bad Request: Missing name or email"); // Retorna uma mensagem de erro
    }

    // Extrai os campos name e email do corpo da requisição
    const { name, email } = req.body;

    // Adiciona um novo usuário ao array `users`
    users.push({
      id: users.length + 1, // Gera um ID único baseado no tamanho atual do array
      name,
      email,
    });

    // Retorna uma resposta de sucesso com o status HTTP 201 (Created)
    return res.writeHead(201).end("User created successfully");
  }

  // Rota não encontrada
  return res
    .writeHead(404) // Define o status HTTP como 404 (Not Found)
    .end("Not Found"); // Retorna uma mensagem de erro
});

// Faz o servidor escutar na porta 3333
server.listen(3333, () => {
  console.log("Server is running on port 3333");
});

/**
 * **Documentação do código:**
 *
 * - **`http.createServer`**:
 *   - Cria um servidor HTTP que escuta requisições e responde com base na lógica definida.
 *
 * - **Rotas disponíveis**:
 *   1. **GET /users**:
 *      - Retorna todos os usuários armazenados no array `users`.
 *      - Responde com o cabeçalho `Content-Type: application/json`.
 *   2. **POST /users**:
 *      - Adiciona um novo usuário ao array `users`.
 *      - Espera que o corpo da requisição seja um JSON válido contendo os campos `name` e `email`.
 *      - Valida a entrada; se faltar algum dado, retorna um erro `400 Bad Request`.
 *      - Caso os dados sejam válidos, adiciona o novo usuário e retorna `201 Created`.
 *
 * - **Validação do corpo da requisição**:
 *   - O corpo da requisição é coletado como chunks de dados e, ao final, é convertido para uma string e parseado como JSON.
 *   - Se não for possível parsear o corpo para JSON, ele é definido como `null`.
 *
 * - **Erro 404**:
 *   - Para todas as rotas que não forem `/users` com os métodos GET ou POST, retorna `404 Not Found`.
 *
 * - **Execução do servidor**:
 *   - O servidor escuta na porta `3333` e imprime uma mensagem no console ao iniciar.
 *
 * - **Array `users`**:
 *   - Serve como um banco de dados em memória para armazenar os usuários criados durante a execução do servidor.
 *   - Cada usuário recebe um ID único baseado no comprimento do array.
 *
 * **Exemplo de uso**:
 *
 * - Enviar uma requisição **GET /users**:
 *   - Retorna: `[]` (vazio inicialmente).
 *
 * - Enviar uma requisição **POST /users** com o corpo:
 *   ```json
 *   {
 *     "name": "John Doe",
 *     "email": "john.doe@example.com"
 *   }
 *   ```
 *   - Responde com: `201 User created successfully`.
 *
 * - Enviar outra requisição **GET /users**:
 *   - Retorna:
 *     ```json
 *     [
 *       {
 *         "id": 1,
 *         "name": "John Doe",
 *         "email": "john.doe@example.com"
 *       }
 *     ]
 *     ```
 */

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
