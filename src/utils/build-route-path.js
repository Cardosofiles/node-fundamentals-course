// Este arquivo contém a função `buildRoutePath`, que é usada para construir uma expressão regular (RegExp)
// baseada em uma rota com parâmetros dinâmicos, como `/users/:id`.
// Isso é útil para mapear rotas e extrair seus valores dinâmicos de forma eficiente.

/**
 * @function buildRoutePath
 * Constrói uma expressão regular (RegExp) para combinar e extrair parâmetros de rotas dinâmicas.
 *
 * @param {string} path - A rota base, que pode conter parâmetros dinâmicos indicados por `:`.
 * Exemplo: `/users/:id`.
 *
 * @returns {RegExp} - Uma expressão regular que pode ser usada para validar e extrair valores de rotas.
 *
 * @example
 * // Exemplo de uso:
 * const regex = buildRoutePath('/users/:id');
 * const match = '/users/123'.match(regex);
 * console.log(match.groups); // { id: "123" }
 */

export function buildRoutePath(path) {
  /**
   * @constant routeParametersRegex
   * Expressão regular para identificar os parâmetros dinâmicos na rota.
   * - Sintaxe: `:paramName` onde `paramName` é o nome do parâmetro.
   * - Exemplo: Em `/users/:id`, o parâmetro identificado é `id`.
   */
  const routeParametersRegex = /:([a-zA-Z]+)/g;

  /**
   * @constant pathWithParams
   * Substitui os parâmetros dinâmicos na rota por grupos nomeados na RegExp.
   * - Grupos nomeados permitem capturar o valor do parâmetro diretamente.
   * - Exemplo: `/users/:id` se torna `/users/(?<id>[a-z0-9-_]+)`.
   *
   * @note
   * - `(?<$1>[a-z0-9-_]+)` é um grupo nomeado. O nome do grupo é baseado no parâmetro identificado (`$1`).
   * - `[a-z0-9-_]+` permite capturar strings contendo letras, números, hífens ou underscores.
   */
  const pathWithParams = path.replaceAll(
    routeParametersRegex,
    "(?<$1>[a-z0-9-_]+)"
  );

  /**
   * @constant pathRegex
   * Combina a rota com os parâmetros e inclui uma parte opcional para query strings.
   * - `^` e `$`: Indicadores de início e fim da string para garantir a correspondência exata.
   * - `(?<query>\\?(.*))?`: Grupo nomeado `query` que captura a query string (opcional).
   *
   * @example
   * Para a rota `/users/:id`:
   * - `/users/123` corresponde com `id = 123`.
   * - `/users/123?active=true` corresponde com `id = 123` e `query = "?active=true"`.
   */
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  // Retorna a expressão regular gerada.
  return pathRegex;
}

/**
 * Explicação detalhada:
 *
 * A função `buildRoutePath` é útil em sistemas de roteamento, como em servidores HTTP.
 * Ela permite transformar rotas dinâmicas definidas como strings em expressões regulares,
 * que podem ser usadas para:
 * - Validar se uma URL corresponde a uma rota definida.
 * - Extrair valores dos parâmetros dinâmicos da URL.
 * - Trabalhar com query strings associadas a essa rota.
 *
 * Exemplos práticos:
 *
 * 1. Criando a RegExp:
 *    ```javascript
 *    const regex = buildRoutePath('/users/:id');
 *    console.log(regex);
 *    // /^\/users\/(?<id>[a-z0-9-_]+)(?<query>\?(.*))?$/
 *    ```
 *
 * 2. Correspondendo uma URL:
 *    ```javascript
 *    const match = '/users/123'.match(buildRoutePath('/users/:id'));
 *    console.log(match.groups);
 *    // { id: "123" }
 *    ```
 *
 * 3. Trabalhando com query strings:
 *    ```javascript
 *    const match = '/users/123?active=true'.match(buildRoutePath('/users/:id'));
 *    console.log(match.groups);
 *    // { id: "123", query: "?active=true" }
 *    ```
 *
 * Uso em um servidor:
 * - Essa função é ideal para sistemas de roteamento personalizados, onde você define rotas dinâmicas
 * e precisa validar ou processar URLs recebidas.
 */
