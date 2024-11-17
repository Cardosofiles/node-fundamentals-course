// Função `json` para processar o corpo de uma requisição HTTP e definir o cabeçalho de resposta como JSON.
// Esta função é um middleware manual para servidores Node.js, permitindo o processamento de dados enviados pelo cliente.
// Abaixo segue uma explicação detalhada de cada parte do código.

/**
 * @function json
 *
 * @description
 * Esta função processa o corpo de requisições HTTP no Node.js, especialmente aquelas que enviam dados no formato JSON.
 * Ela lê o fluxo de dados da requisição, junta os chunks recebidos e tenta convertê-los em um objeto JavaScript.
 * Caso a conversão falhe (exemplo: JSON inválido ou corpo vazio), a propriedade `req.body` será definida como `null`.
 * Além disso, a função define o cabeçalho da resposta HTTP como "Content-Type: application/json", indicando que
 * a resposta retornada pelo servidor será no formato JSON.
 *
 * @param {Object} req - Objeto da requisição HTTP. Este objeto é uma `Readable Stream` que contém os dados enviados pelo cliente.
 * @param {Object} res - Objeto da resposta HTTP. Este objeto é uma `Writable Stream` usado para enviar dados de volta ao cliente.
 *
 * @returns {void} - A função não retorna valores. Ela modifica diretamente os objetos `req` e `res`.
 *
 * @example
 * // Exemplo de uso com um servidor HTTP em Node.js:
 * import http from "node:http";
 * import { json } from "./json.js";
 *
 * const server = http.createServer(async (req, res) => {
 *   await json(req, res);
 *
 *   if (req.body) {
 *     res.end(JSON.stringify({ message: "Dados recebidos com sucesso!", data: req.body }));
 *   } else {
 *     res.writeHead(400).end(JSON.stringify({ error: "JSON inválido ou corpo vazio" }));
 *   }
 * });
 *
 * server.listen(3333, () => console.log("Servidor rodando na porta 3333"));
 */

export async function json(req, res) {
  // Array para armazenar os chunks (pedaços) de dados recebidos da requisição.
  // Cada chunk representa uma parte do corpo da requisição enviada pelo cliente.
  const buffers = [];

  // Itera sobre os chunks de dados enviados pelo cliente.
  // O loop `for await` permite que essa operação seja realizada de forma assíncrona,
  // garantindo que todos os chunks sejam processados antes de continuar.
  for await (const chunk of req) {
    buffers.push(chunk); // Adiciona cada chunk recebido ao array `buffers`.
  }

  // Tenta converter os chunks concatenados em um objeto JSON.
  // `Buffer.concat(buffers)` junta todos os chunks em um único buffer.
  // `.toString()` transforma o buffer em uma string legível, que será interpretada como JSON.
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    // Se a conversão para JSON falhar (ex.: JSON inválido ou corpo vazio),
    // `req.body` será definido como `null`, indicando que não há dados válidos.
    req.body = null;
  }

  // Define o cabeçalho da resposta HTTP como "Content-Type: application/json".
  // Isso indica ao cliente que os dados retornados pelo servidor estarão no formato JSON.
  res.setHeader("Content-Type", "application/json");
}
