import http from "node:http";

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
 * PUT => Atualizar um recurso no back-en
 * PATCH => Atualizar um recurso específico no back-end
 * DELETE => Deletar um recurso no back-end
 *
 * GET / users => Buscando usuários do back-end
 * POST / users => Criar um usuário no back-end
 */

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/users") {
    return res.end("Listando os usuários");
  }

  if (method === "POST" && url === "/users") {
    return res.end("Criando um novo usuário");
  }

  return res.end("hello Javascript and TypeScript");
});

server.listen(3333, () => {
  console.log("Server is running on port 3333");
});
