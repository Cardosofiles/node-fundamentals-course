// Este arquivo define as rotas de uma API REST simulada para gerenciar usuários.
// Ele utiliza as classes `Database` e `buildRoutePath` para lidar com a manipulação de dados e construção de rotas dinâmicas.

// Importações:
// - `randomUUID`: Gera identificadores únicos para novos usuários.
// - `Database`: Classe para gerenciar operações CRUD persistentes em um arquivo JSON.
// - `buildRoutePath`: Função que converte rotas com parâmetros dinâmicos em expressões regulares para correspondência.
import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

// Instância do banco de dados para gerenciar os dados dos usuários.
const database = new Database();

// Define as rotas disponíveis na API.
export const routes = [
  /**
   * Rota para buscar usuários.
   *
   * Método: GET
   * Caminho: /users
   *
   * Query params:
   * - `search`: (opcional) Filtra usuários pelo nome ou email.
   *
   * Exemplo:
   * GET /users?search=John
   *
   * Retorno:
   * - Status 200: Lista de usuários correspondentes.
   */
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { search } = req.query; // Obtém o parâmetro de busca da query string.

      // Busca os usuários no banco de dados, filtrando pelo parâmetro `search` se fornecido.
      const users = database.select(
        "users",
        search
          ? {
              name: search,
              email: search,
            }
          : null
      );

      // Retorna os usuários encontrados no formato JSON.
      return res
        .setHeader("Content-type", "application/json")
        .end(JSON.stringify(users));
    },
  },

  /**
   * Rota para criar um novo usuário.
   *
   * Método: POST
   * Caminho: /users
   *
   * Corpo da requisição (JSON):
   * - `name`: Nome do usuário (obrigatório).
   * - `email`: Email do usuário (obrigatório).
   *
   * Exemplo:
   * POST /users
   * Body: { "name": "John Doe", "email": "john@example.com" }
   *
   * Retorno:
   * - Status 201: Usuário criado com sucesso.
   * - Status 400: Erro se `name` ou `email` estiver ausente.
   */
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      // Valida se os campos obrigatórios estão presentes no corpo da requisição.
      if (!req.body || !req.body.name || !req.body.email) {
        return res.writeHead(400).end("Bad Request: Missing name or email");
      }

      const { name, email } = req.body;

      // Cria um objeto de usuário com um ID único.
      const user = {
        id: randomUUID(),
        name,
        email,
      };

      // Insere o novo usuário no banco de dados.
      database.insert("users", user);

      return res.writeHead(201).end("User created successfully");
    },
  },

  /**
   * Rota para atualizar um usuário existente.
   *
   * Método: PUT
   * Caminho: /users/:id
   *
   * Parâmetros de rota:
   * - `id`: ID do usuário a ser atualizado.
   *
   * Corpo da requisição (JSON):
   * - `name`: Novo nome do usuário (opcional).
   * - `email`: Novo email do usuário (opcional).
   *
   * Exemplo:
   * PUT /users/1234
   * Body: { "name": "Jane Doe", "email": "jane@example.com" }
   *
   * Retorno:
   * - Status 204: Dados atualizados com sucesso.
   */
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params; // Obtém o ID do usuário da URL.
      const { name, email } = req.body; // Obtém os dados do corpo da requisição.

      // Atualiza o registro do usuário no banco de dados.
      database.update("users", id, {
        name,
        email,
      });

      return res.writeHead(204).end("Data updated successfully");
    },
  },

  /**
   * Rota para excluir um usuário.
   *
   * Método: DELETE
   * Caminho: /users/:id
   *
   * Parâmetros de rota:
   * - `id`: ID do usuário a ser excluído.
   *
   * Exemplo:
   * DELETE /users/1234
   *
   * Retorno:
   * - Status 204: Usuário excluído com sucesso.
   */
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params; // Obtém o ID do usuário da URL.

      // Remove o registro do usuário no banco de dados.
      database.delete("users", id);

      return res.writeHead(204).end("User deleted successfully");
    },
  },
];

/**
 * Explicação geral:
 *
 * Este código implementa uma API REST com operações básicas de CRUD para gerenciar usuários.
 *
 * - `GET /users`: Retorna a lista de usuários, com suporte a busca por nome ou email.
 * - `POST /users`: Cria um novo usuário, exigindo `name` e `email`.
 * - `PUT /users/:id`: Atualiza o nome e/ou email de um usuário existente.
 * - `DELETE /users/:id`: Exclui um usuário com base no ID.
 *
 * A implementação utiliza:
 * - Persistência de dados no arquivo `db.json` com a classe `Database`.
 * - Geração de IDs únicos com `randomUUID`.
 * - Roteamento dinâmico com a função `buildRoutePath`.
 *
 * Este código é ideal para estudos ou prototipagem de APIs REST.
 */
