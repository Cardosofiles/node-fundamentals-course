// Este arquivo contém a função `extractQueryParams`, que é usada para processar strings de consulta (query strings)
// presentes em URLs e convertê-las em um objeto de chave-valor.
// Isso é útil para trabalhar com os parâmetros enviados em requisições HTTP, como `?search=Diego&age=25`.

/**
 * @function extractQueryParams
 * Converte uma query string em um objeto de chave-valor para facilitar o acesso aos parâmetros.
 *
 * @param {string} query - A query string da URL (deve começar com `?`).
 * Exemplo: `?search=Diego&age=25`.
 *
 * @returns {Object} - Um objeto onde as chaves são os nomes dos parâmetros e os valores são os respectivos valores.
 *
 * @example
 * // Exemplo de uso:
 * const queryParams = extractQueryParams("?search=Diego&age=25");
 * console.log(queryParams);
 * // { search: "Diego", age: "25" }
 */
export function extractQueryParams(query) {
  /**
   * 1. `query.substr(1)`:
   *    Remove o caractere inicial `?` da query string.
   *    Exemplo: `"?search=Diego"` -> `"search=Diego"`.
   */
  return (
    query
      .substr(1)
      /**
       * 2. `.split("&")`:
       *    Divide a string em uma lista de pares chave-valor, separados por `&`.
       *    Exemplo: `"search=Diego&age=25"` -> `["search=Diego", "age=25"]`.
       */
      .split("&")
      /**
       * 3. `.reduce(...)`:
       *    Transforma a lista de pares chave-valor em um único objeto.
       *
       *    - `queryParams`: O objeto acumulador que será preenchido.
       *    - `param`: Um par chave-valor no formato `key=value`.
       */
      .reduce((queryParams, param) => {
        /**
         * 4. `param.split("=")`:
         *    Divide o par chave-valor em uma chave (`key`) e um valor (`value`).
         *    Exemplo: `"search=Diego"` -> `["search", "Diego"]`.
         */
        const [key, value] = param.split("=");

        /**
         * 5. `queryParams[key] = value`:
         *    Adiciona o par chave-valor ao objeto acumulador.
         *    Exemplo: `queryParams["search"] = "Diego"`.
         */
        queryParams[key] = value;

        /**
         * 6. Retorna o objeto acumulador atualizado para o próximo par.
         */
        return queryParams;
      }, {})
  ); // Inicializa o acumulador como um objeto vazio (`{}`).
}

/**
 * Explicação detalhada:
 *
 * A função `extractQueryParams` é útil em cenários onde você precisa trabalhar com os parâmetros de uma query string,
 * como em APIs ou aplicativos web.
 *
 * - **Query string**: É a parte de uma URL que contém parâmetros, começando com `?`.
 *   Exemplo: Em `https://example.com?search=Diego&age=25`, a query string é `?search=Diego&age=25`.
 *
 * - **Por que transformar em objeto?**
 *   Trabalhar com um objeto é mais fácil e legível do que manipular strings diretamente.
 *   Você pode acessar os valores diretamente pelas chaves.
 *
 * Exemplos práticos:
 *
 * 1. Conversão básica:
 *    ```javascript
 *    const queryParams = extractQueryParams("?search=Diego&age=25");
 *    console.log(queryParams);
 *    // { search: "Diego", age: "25" }
 *    ```
 *
 * 2. Lidando com uma query string simples:
 *    ```javascript
 *    const queryParams = extractQueryParams("?active=true");
 *    console.log(queryParams);
 *    // { active: "true" }
 *    ```
 *
 * 3. Trabalhando com uma API:
 *    Em uma API que recebe uma URL como `/users?name=Diego&role=admin`, você pode usar essa função para acessar
 *    os valores `name` e `role` de forma prática.
 *
 * Pontos importantes:
 * - A função espera que a string seja bem formatada. Se estiver fora do padrão (`key=value`), o comportamento pode ser imprevisível.
 * - Ela não faz decodificação automática de caracteres URL-encoded (como `%20` para espaço). Para isso, você pode usar `decodeURIComponent`.
 *
 * Adicione este código ao seu repositório GitHub como referência para trabalhar com query strings!
 */
