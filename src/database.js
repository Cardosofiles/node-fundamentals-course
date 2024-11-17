// Este arquivo implementa uma classe `Database` para gerenciar dados em um arquivo JSON (`db.json`).
// Essa classe permite realizar operações de CRUD (Create, Read, Update, Delete) em tabelas simuladas,
// com persistência automática no arquivo `db.json`.

// Importa módulos do Node.js:
// - `fs/promises`: Para operações assíncronas no sistema de arquivos.
// - `path`: Para manipular caminhos de arquivos.
import fs from "node:fs/promises";
import path from "node:path";

// Define o caminho absoluto para o arquivo `db.json` na raiz do projeto.
const databasePath = path.resolve("db.json");
console.log(databasePath); // Log do caminho para debug.

// Define a classe `Database` para gerenciar as operações no arquivo JSON.
export class Database {
  // Propriedade privada para armazenar os dados carregados do arquivo JSON.
  #database = {};

  // Construtor que inicializa a classe e carrega os dados do arquivo JSON.
  constructor() {
    // Lê o conteúdo do arquivo `db.json`.
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        // Se o arquivo existir e estiver formatado corretamente, carrega os dados na propriedade `#database`.
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        // Caso o arquivo não exista ou ocorra um erro, cria um arquivo vazio.
        this.#persist();
      });
  }

  /**
   * Método privado para salvar os dados da propriedade `#database` no arquivo JSON.
   * É chamado automaticamente após operações que modificam os dados.
   */
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  /**
   * @method select
   * Retorna os dados de uma tabela, com opção de filtro.
   *
   * @param {string} table - Nome da tabela para buscar os dados.
   * @param {object} [search] - Objeto de filtro para buscar registros específicos.
   * @returns {Array} - Lista de registros da tabela, filtrados ou completos.
   *
   * @example
   * db.select("users", { name: "John" });
   * // Retorna todos os usuários cujo nome contenha "John" (case-insensitive).
   */
  select(table, search) {
    let db = this.#database[table] ?? []; // Retorna uma tabela ou array vazio.

    if (search) {
      // Filtra os registros baseados no objeto `search`.
      db = db.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          // Faz busca case-insensitive em valores do objeto.
          return row[key]?.toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return db; // Retorna os registros filtrados ou completos.
  }

  /**
   * @method insert
   * Adiciona um novo registro a uma tabela. Cria a tabela se ela não existir.
   *
   * @param {string} table - Nome da tabela para inserir os dados.
   * @param {object} data - Objeto a ser inserido na tabela.
   * @returns {object} - O registro inserido.
   *
   * @example
   * db.insert("users", { id: 1, name: "John", email: "john@example.com" });
   */
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      // Adiciona o registro na tabela existente.
      this.#database[table].push(data);
    } else {
      // Cria a tabela com o primeiro registro.
      this.#database[table] = [data];
    }

    this.#persist(); // Salva os dados atualizados no arquivo JSON.

    return data; // Retorna o registro inserido.
  }

  /**
   * @method update
   * Atualiza um registro em uma tabela com base no ID.
   *
   * @param {string} table - Nome da tabela para atualizar o registro.
   * @param {string|number} id - ID do registro a ser atualizado.
   * @param {object} data - Novos dados para o registro.
   *
   * @example
   * db.update("users", 1, { name: "Jane Doe", email: "jane@example.com" });
   */
  update(table, id, data) {
    // Encontra o índice do registro com o ID especificado.
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // Atualiza o registro com os novos dados.
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist(); // Salva os dados atualizados no arquivo JSON.
    }
  }

  /**
   * @method delete
   * Remove um registro de uma tabela com base no ID.
   *
   * @param {string} table - Nome da tabela para remover o registro.
   * @param {string|number} id - ID do registro a ser removido.
   *
   * @example
   * db.delete("users", 1);
   */
  delete(table, id) {
    // Encontra o índice do registro com o ID especificado.
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // Remove o registro do array.
      this.#database[table].splice(rowIndex, 1);
      this.#persist(); // Salva os dados atualizados no arquivo JSON.
    }
  }
}

/**
 * Explicação:
 *
 * Esta classe simula um banco de dados usando um arquivo JSON para armazenar dados de forma persistente.
 *
 * - **select**: Lê os dados de uma tabela e permite filtrá-los.
 * - **insert**: Adiciona novos registros a uma tabela.
 * - **update**: Atualiza registros existentes com base em seu ID.
 * - **delete**: Remove registros de uma tabela com base no ID.
 *
 * Vantagens:
 * - Simples de usar e entender.
 * - Não exige dependências externas além do Node.js.
 *
 * Limitações:
 * - Não é eficiente para grandes volumes de dados.
 * - Não oferece controle transacional ou outros recursos avançados de bancos de dados reais.
 *
 * Este código é útil para projetos pequenos ou como aprendizado sobre manipulação de arquivos no Node.js.
 */
