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
