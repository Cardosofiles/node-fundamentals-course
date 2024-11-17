import { randomUUID } from "node:crypto";
import http from "node:http";
import { Database } from "./database.js";
import { json } from "./middlewares/json.js";

const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  if (method === "GET" && url === "/users") {
    const users = database.select("users");

    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    if (!req.body || !req.body.name || !req.body.email) {
      return res.writeHead(400).end("Bad Request: Missing name or email");
    }

    const { name, email } = req.body;
    const users = database.select("users") || [];

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
  }

  return res.writeHead(404).end("Not Found");
});

server.listen(3333, () => {
  console.log("Server is running on port 3333");
});
