// Importa o módulo HTTP nativo do Node.js para criar um servidor web
import http from "node:http";
// Importa a classe Transform do módulo de streams do Node.js, usada para transformar dados
import { Transform } from "stream";

// Classe personalizada que transforma números em seus inversos multiplicando por -1
class InverseNumberStream extends Transform {
  /**
   * Método especial `_transform` que processa cada chunk da stream.
   * É chamado automaticamente para cada pedaço de dados recebido.
   *
   * @param {Buffer|string} chunk - O pedaço de dados recebido na stream.
   * @param {string} encoding - O tipo de codificação do dado. Ignorado se o dado for um buffer.
   * @param {Function} callback - Função de callback para indicar que o processamento do chunk foi concluído.
   */
  _transform(chunk, encoding, callback) {
    // Converte o chunk para string, transforma em número e multiplica por -1
    const transformed = Number(chunk.toString()) * -1;
    // Exibe o número transformado no console para fins de depuração
    console.log(transformed);
    // Passa o número transformado como um buffer para a próxima etapa da stream
    callback(null, Buffer.from(String(transformed)));
  }
}

/**
 * Cria um servidor HTTP com o método `createServer`, que recebe uma função callback.
 * Essa função é executada a cada requisição recebida pelo servidor.
 */
const server = http.createServer(async (req, res) => {
  // Array para armazenar os pedaços (chunks) de dados da requisição
  const buffers = [];

  /**
   * Usa um loop `for await` para iterar sobre os chunks de dados recebidos na stream da requisição.
   * Cada chunk é adicionado ao array `buffers`.
   */
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  /**
   * Combina todos os chunks armazenados no array `buffers` em um único buffer
   * e converte o conteúdo completo para string.
   */
  const fullStreamContent = Buffer.concat(buffers).toString();
  // Exibe o conteúdo completo da stream no console
  console.log(fullStreamContent);

  /**
   * O código atualmente retorna o conteúdo completo da stream, mas isso não é uma
   * resposta válida para o cliente.
   * Em um caso real, você poderia substituir essa lógica por um processamento ou
   * responder diretamente ao cliente.
   */
  return fullStreamContent;

  /**
   * Alternativamente, o código poderia processar a stream usando a classe `InverseNumberStream`:
   *
   * return req.pipe(new InverseNumberStream()).pipe(res);
   *
   * Aqui, a requisição (`req`) seria transformada pela `InverseNumberStream` e
   * enviada de volta como resposta (`res`) ao cliente.
   */
});

// Inicia o servidor na porta 3334 e exibe uma mensagem no console indicando que está ativo
server.listen(3334, () => {
  console.log("Server is running on port 3334");
});
