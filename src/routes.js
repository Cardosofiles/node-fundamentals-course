import { randomUUID } from "node:crypto";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/users",
    handler: (req, res) => {
      const users = database.select("users");

      return res
        .setHeader("Content-type", "application/json")
        .end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: "/users",
    handler: (req, res) => {
      if (!req.body || !req.body.name || !req.body.email) {
        return res.writeHead(400).end("Bad Request: Missing name or email");
      }

      const { name, email } = req.body;

      const user = {
        /**
         * Duas opção para gerar o ID
         * "id: users.length + 1", cria um sequencial
         * "id: randomUUID()", gera um id aleatório para o registro
         */
        id: randomUUID(),
        name,
        email,
      };

      database.insert("users", user);

      return res.writeHead(201).end("User created successfully");
    },
  },
];
