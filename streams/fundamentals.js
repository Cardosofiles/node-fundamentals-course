// Importa os módulos nativos do Node.js para trabalhar com streams e o sistema de arquivos.
const fs = require("fs");
const { Transform } = require("stream");

/**
 * EXEMPLO DE STREAM DE LEITURA
 * - Cria uma stream de leitura a partir de um arquivo.
 * - O arquivo 'input.txt' deve existir no mesmo diretório.
 * - Streams de leitura permitem processar grandes arquivos sem carregá-los inteiramente na memória.
 */
const readStream = fs.createReadStream("input.txt", { encoding: "utf-8" });

/**
 * EXEMPLO DE STREAM DE ESCRITA
 * - Cria uma stream de escrita para gravar dados em um arquivo.
 * - O arquivo 'output.txt' será criado automaticamente se não existir.
 * - Streams de escrita permitem gravar dados de maneira incremental em um destino.
 */
const writeStream = fs.createWriteStream("output.txt");

/**
 * EXEMPLO DE STREAM DE TRANSFORMAÇÃO
 * - Cria uma stream de transformação para modificar dados durante o fluxo.
 * - Streams de transformação são usadas para aplicar filtros, compactação, criptografia ou outras alterações.
 * - Neste caso, convertemos os caracteres recebidos para maiúsculas.
 */
const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    /**
     * O método `transform` é chamado para cada pedaço de dados (chunk).
     * - `chunk`: Dados recebidos no fluxo (Buffer ou string).
     * - `encoding`: Codificação (se os dados forem strings, por exemplo, 'utf-8').
     * - `callback`: Deve ser chamado com os dados transformados ou com um erro.
     */
    const transformedData = chunk.toString().toUpperCase(); // Converte para maiúsculas.
    callback(null, transformedData); // Passa os dados transformados para o próximo estágio.
  },
});

/**
 * EVENTOS NA STREAM DE LEITURA
 * - As streams emitem eventos para sinalizar o progresso ou erros.
 */
readStream
  .on("data", (chunk) => {
    // Evento 'data': Chamado sempre que um pedaço de dados é lido.
    console.log(`Dados lidos: ${chunk}`);
  })
  .on("error", (error) => {
    // Evento 'error': Chamado em caso de erro durante a leitura.
    console.error(`Erro na leitura: ${error.message}`);
  })
  .on("end", () => {
    // Evento 'end': Chamado quando a leitura termina (não há mais dados).
    console.log("Leitura do arquivo concluída.");
  });

/**
 * EVENTOS NA STREAM DE ESCRITA
 * - Similar à leitura, a escrita também emite eventos.
 */
writeStream.on("finish", () => {
  // Evento 'finish': Chamado quando todos os dados foram gravados no destino.
  console.log("Gravação no arquivo concluída.");
});

/**
 * ENCADEAMENTO DE STREAMS
 * - Streams podem ser conectadas (encadeadas) com o método `pipe`.
 * - Isso permite passar dados automaticamente de uma stream para outra.
 * - Aqui, os dados lidos são transformados e gravados:
 *   - readStream -> transformStream -> writeStream
 */
readStream.pipe(transformStream).pipe(writeStream);

console.log(
  "Encadeamento iniciado: Lendo de 'input.txt', transformando e gravando em 'output.txt'."
);

/**
 * DETALHAMENTO DOS MÉTODOS E EVENTOS:
 *
 * 1. Métodos principais:
 *    - `fs.createReadStream(path, options)`: Cria uma stream para ler dados de um arquivo.
 *    - `fs.createWriteStream(path)`: Cria uma stream para gravar dados em um arquivo.
 *    - `pipe(destination)`: Conecta streams, enviando dados de uma origem para um destino.
 *    - `new Transform(options)`: Cria uma stream que pode modificar dados no fluxo.
 *
 * 2. Eventos comuns:
 *    - `data`: Emitido quando novos dados estão disponíveis para leitura.
 *    - `end`: Emitido quando a leitura é concluída.
 *    - `error`: Emitido em caso de erro (na leitura ou gravação).
 *    - `finish`: Emitido quando a escrita no destino termina.
 *
 * 3. Fluxo de execução:
 *    - O arquivo `input.txt` é lido em pedaços.
 *    - Cada pedaço é convertido para maiúsculas pela `transformStream`.
 *    - Os dados transformados são gravados em `output.txt`.
 *
 * EXEMPLO:
 * - Se o conteúdo de 'input.txt' for:
 *     Hello, Node.js streams!
 * - O conteúdo final de 'output.txt' será:
 *     HELLO, NODE.JS STREAMS!
 *
 * USO PRÁTICO:
 * - Streams são úteis para processar grandes arquivos ou fluxos de dados contínuos
 *   sem sobrecarregar a memória, tornando-as ideais para aplicações escaláveis.
 */
