// Este arquivo define o servidor HTTP principal que gerencia as requisições e respostas da aplicação.
// Ele utiliza os módulos internos do Node.js e arquivos auxiliares para processar rotas, middlewares e parâmetros de URL.

// Importações:
// - `http`: Módulo nativo para criar e gerenciar servidores HTTP.
// - `json`: Middleware para lidar com requisições JSON.
// - `routes`: Conjunto de rotas definidas na aplicação.
// - `extractQueryParams`: Função para extrair parâmetros da query string.
import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

// Criação do servidor HTTP.
const server = http.createServer(async (req, res) => {
  // Extração do método e da URL da requisição.
  const { method, url } = req;

  // Middleware `json`: Processa o corpo da requisição e o adiciona como `req.body`.
  await json(req, res);

  // Encontra a rota correspondente com base no método HTTP e no caminho da URL.
  const route = routes.find((r) => {
    return r.method === method && r.path.test(url); // Testa a URL contra o padrão da rota (expressão regular).
  });

  if (route) {
    // Extrai os parâmetros de rota com base no padrão definido em `routes`.
    const routeParams = req.url.match(route.path);

    // Separa os parâmetros de rota e a query string.
    const { query, ...params } = routeParams.groups;

    // Adiciona os parâmetros de rota (`req.params`) e query (`req.query`) ao objeto da requisição.
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    // Executa o handler da rota correspondente, passando `req` e `res`.
    return route.handler(req, res);
  }

  // Retorna uma resposta 404 se nenhuma rota correspondente for encontrada.
  return res.writeHead(404).end("Not Found");
});

// Faz o servidor escutar na porta 3333.
server.listen(3333, () => {
  console.log("Server is running on port 3333");
});

/**
 * Explicação detalhada:
 *
 * 1. **Criação do Servidor:**
 *    O servidor é criado usando `http.createServer`, que fornece os objetos `req` (requisição) e `res` (resposta).
 *
 * 2. **Middleware JSON:**
 *    O middleware `json` é chamado para processar o corpo da requisição e convertê-lo em um objeto JavaScript
 *    acessível por meio de `req.body`. Isso é essencial para rotas que lidam com dados enviados via POST ou PUT.
 *
 * 3. **Resolução de Rotas:**
 *    - A variável `routes` contém todas as rotas disponíveis na aplicação.
 *    - O método e o caminho da URL da requisição são comparados com cada rota.
 *    - Se uma rota correspondente é encontrada, os parâmetros de rota e query string são extraídos e adicionados ao objeto da requisição.
 *
 * 4. **Execução do Handler:**
 *    O `handler` da rota é executado, sendo responsável por processar a requisição e retornar a resposta apropriada.
 *
 * 5. **Resposta 404:**
 *    Caso nenhuma rota correspondente seja encontrada, o servidor retorna o status 404 com a mensagem "Not Found".
 *
 * 6. **Início do Servidor:**
 *    O servidor é configurado para escutar na porta 3333. Quando iniciado, exibe a mensagem "Server is running on port 3333" no console.
 *
 * **Fluxo Resumido:**
 * - Uma requisição é recebida pelo servidor.
 * - O corpo da requisição é processado pelo middleware `json`.
 * - A URL e o método HTTP são comparados com as rotas definidas.
 * - Parâmetros de rota e query string são extraídos, e o handler da rota correspondente é executado.
 * - Se nenhuma rota for encontrada, é retornada uma resposta 404.
 *
 * **Estrutura do Projeto:**
 * - `middlewares/json.js`: Middleware para lidar com JSON.
 * - `routes.js`: Define as rotas da aplicação.
 * - `utils/extract-query-params.js`: Função utilitária para manipular query strings.
 *
 * Este código é ideal para estudos e para entender os conceitos básicos de criação de servidores HTTP com Node.js.
 */
