// Importa a classe Readable do módulo de streams do Node.js
import { Readable } from "stream";

/**
 * Classe personalizada que gera uma sequência de números de 1 a 5 como uma Readable Stream.
 */
class OndeToHundredStream extends Readable {
  constructor() {
    super(); // Chama o construtor da classe base Readable
    this.index = 1; // Inicializa o índice com 1
  }

  /**
   * Método _read:
   * Este método é chamado automaticamente para gerar dados para a stream.
   */
  _read() {
    const i = this.index++; // Incrementa o índice a cada chamada

    // Simula um atraso de 1 segundo para cada número
    setTimeout(() => {
      if (i > 5) {
        // Quando o índice ultrapassa 5, finaliza a stream
        this.push(null);
      } else {
        // Converte o número atual para um Buffer e o envia para a stream
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 1000);
  }
}

/**
 * Faz uma requisição HTTP POST para o servidor em http://localhost:3334
 * Envia os números de 1 a 5 como corpo da requisição usando a classe OndeToHundredStream.
 */
fetch("http://localhost:3334", {
  method: "POST", // Define o método HTTP como POST
  body: new OndeToHundredStream(), // Define o corpo da requisição como a stream personalizada
  duplex: "half", // Configura o modo duplex, necessário para streams no fetch
  headers: {
    "Content-Type": "application/octet-stream", // Define o tipo de conteúdo como stream de bytes
  },
})
  .then((res) => {
    // Converte a resposta do servidor para texto
    return res.text().then((data) => {
      // Exibe o conteúdo da resposta no console
      console.log(data);
      // Exibe o status da resposta no console
      console.log(`Código rodou, response status: ${res.status}`);
    });
  })
  .catch((err) => {
    // Trata e exibe erros de requisição no console
    console.log(`Response error: ${err.message}`);
  });

/**
 * Explicação detalhada:
 *
 * 1. **Classe OndeToHundredStream**:
 *    - É uma Readable Stream que gera números sequenciais de 1 a 5 com um intervalo de 1 segundo entre cada número.
 *    - Utiliza o método `_read` para enviar os dados gerados.
 *    - Quando o índice (i) ultrapassa 5, chama `this.push(null)` para indicar o final da stream.
 *
 * 2. **fetch**:
 *    - Envia uma requisição HTTP para o servidor em `http://localhost:3334`.
 *    - O corpo da requisição é a instância da classe `OndeToHundredStream`, que envia os números como stream.
 *    - Define o cabeçalho `Content-Type` como `application/octet-stream` para indicar que o corpo é binário.
 *
 * 3. **duplex: "half"**:
 *    - Configuração necessária para que o fetch suporte streams no corpo da requisição.
 *    - Disponível em versões recentes do Node.js.
 *
 * 4. **then**:
 *    - Manipula a resposta do servidor, converte o conteúdo para texto e o exibe no console.
 *    - Exibe o status HTTP da resposta.
 *
 * 5. **catch**:
 *    - Trata erros de rede ou de processamento e exibe mensagens no console.
 *
 * 6. **Execução**:
 *    - A stream envia números sequencialmente para o servidor, um a cada segundo.
 *    - O servidor processa os números e retorna uma resposta (dependendo da lógica do servidor).
 *    - O cliente exibe a resposta e o status no console.
 */
