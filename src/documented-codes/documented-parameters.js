// Importa o módulo http nativo do Node.js para criar o servidor
import http from "node:http";
import { URL } from "node:url";

// Array em memória para armazenar dados
const items = [];

// Função para analisar query parameters
function parseQueryParams(url) {
  const parsedUrl = new URL(url, `http://localhost`);
  const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
  return queryParams;
}

// Criação do servidor
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Dividindo a URL para capturar rota e parâmetros
  const [route, routeParam] = url.split("/").filter(Boolean);

  // Variável para armazenar o corpo da requisição (Request Body)
  let requestBody = null;

  // Lendo o corpo da requisição
  if (method === "POST" || method === "PUT") {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    try {
      requestBody = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
      requestBody = null; // Define como null caso não seja JSON válido
    }
  }

  /**
   * Rota: Listar itens (GET /items)
   * - Suporta query parameters para filtragem.
   */
  if (method === "GET" && route === "items") {
    const queryParams = parseQueryParams(url); // Analisa query parameters
    if (Object.keys(queryParams).length > 0) {
      // Retorna itens filtrados por query parameters
      const filteredItems = items.filter((item) =>
        Object.entries(queryParams).every(([key, value]) => item[key] === value)
      );
      return res
        .setHeader("Content-Type", "application/json")
        .end(JSON.stringify(filteredItems));
    }

    // Retorna todos os itens caso não haja query parameters
    return res
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(items));
  }

  /**
   * Rota: Adicionar um novo item (POST /items)
   * - Requer um Request Body com `name` e `value`.
   */
  if (method === "POST" && route === "items") {
    if (!requestBody || !requestBody.name || !requestBody.value) {
      return res
        .writeHead(400)
        .end("Bad Request: Missing name or value in request body");
    }

    const newItem = {
      id: items.length + 1,
      name: requestBody.name,
      value: requestBody.value,
    };
    items.push(newItem);

    return res
      .writeHead(201, { "Content-Type": "application/json" })
      .end(JSON.stringify(newItem));
  }

  /**
   * Rota: Atualizar um item (PUT /items/:id)
   * - Usa Route Parameters para identificar o item.
   * - Usa Request Body para atualizar os dados.
   */
  if (method === "PUT" && route === "items" && routeParam) {
    const id = parseInt(routeParam, 10);
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.writeHead(404).end("Item not found");
    }

    if (!requestBody || (!requestBody.name && !requestBody.value)) {
      return res
        .writeHead(400)
        .end("Bad Request: Missing name or value in request body");
    }

    // Atualiza o item existente
    items[itemIndex] = {
      ...items[itemIndex],
      ...requestBody,
    };

    return res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify(items[itemIndex]));
  }

  /**
   * Rota: Remover um item (DELETE /items/:id)
   * - Usa Route Parameters para identificar o item.
   */
  if (method === "DELETE" && route === "items" && routeParam) {
    const id = parseInt(routeParam, 10);
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.writeHead(404).end("Item not found");
    }

    items.splice(itemIndex, 1); // Remove o item pelo índice
    return res.writeHead(204).end(); // Retorna status 204 (No Content)
  }

  // Rota não encontrada
  return res.writeHead(404).end("Not Found");
});

// Faz o servidor escutar na porta 3333
server.listen(3333, () => {
  console.log("Server is running on port 3333");
});

/**
 * **Explicação detalhada:**
 *
 * - **Query Parameters**:
 *   - São usados na rota `/items` (GET).
 *   - Exemplo: `/items?name=example&value=10` filtra os itens com `name` igual a `example` e `value` igual a `10`.
 *   - É feita a análise usando `URL` e `searchParams`.
 *
 * - **Route Parameters**:
 *   - Usados nas rotas `/items/:id` (PUT e DELETE).
 *   - Exemplo: `/items/1` identifica o item com `id` igual a `1`.
 *   - O parâmetro é extraído da URL e convertido para um número.
 *
 * - **Request Body**:
 *   - Usado nas rotas `/items` (POST) e `/items/:id` (PUT).
 *   - Exemplo:
 *     - POST:
 *       ```json
 *       {
 *         "name": "example",
 *         "value": 10
 *       }
 *       ```
 *     - PUT:
 *       ```json
 *       {
 *         "name": "new name"
 *       }
 *       ```
 *   - O corpo da requisição é coletado e convertido de Buffer para JSON.
 *
 * **Testando o servidor:**
 * 1. GET `/items` - Lista todos os itens ou filtra com query parameters.
 * 2. POST `/items` - Adiciona um novo item (necessário enviar o body).
 * 3. PUT `/items/:id` - Atualiza o item com o ID fornecido.
 * 4. DELETE `/items/:id` - Remove o item com o ID fornecido.
 */
