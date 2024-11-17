import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const users = database.select("users");

      return res
        .setHeader("Content-type", "application/json")
        .end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      if (!req.body || !req.body.name || !req.body.email) {
        return res.writeHead(400).end("Bad Request: Missing name or email");
      }

      const { name, email } = req.body;

      const user = {
        id: randomUUID(),
        name,
        email,
      };

      database.insert("users", user);
      return res.writeHead(201).end("User created successfully");
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("users", id);

      return res.writeHead(204).end("User deleted successfully");
    },
  },
];
