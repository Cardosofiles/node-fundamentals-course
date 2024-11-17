// Este arquivo demonstra o uso do módulo `stream` do Node.js para criar e manipular fluxos de dados personalizados.
// O código contém três tipos de streams: Readable, Transform e Writable.
// Cada um desses fluxos tem uma funcionalidade específica e é encadeado para realizar operações sequenciais nos dados.

/**
 * @description
 * Este código utiliza streams personalizados para:
 * 1. Gerar números de 1 a 100 (`OndeToHundredStream` - Readable Stream).
 * 2. Inverter o sinal desses números (`InverseNumberStream` - Transform Stream).
 * 3. Multiplicar os números resultantes por 10 e exibi-los no console (`MultiplyByTenStream` - Writable Stream).
 *
 * Streams no Node.js permitem processar grandes volumes de dados de forma eficiente, dividindo-os em chunks.
 * Neste exemplo, usamos fluxos para demonstrar operações matemáticas simples.
 *
 * Classes usadas:
 * - `Readable`: Produz dados.
 * - `Transform`: Modifica os dados enquanto eles fluem.
 * - `Writable`: Consome os dados ao final do fluxo.
 */

// Importa os tipos de streams necessários do módulo nativo `node:stream`.
import { Readable, Transform, Writable } from "node:stream";

/**
 * @class OndeToHundredStream
 * Classe que gera números de 1 a 100 em intervalos de 1 segundo.
 * Estende a classe `Readable`, permitindo criar um fluxo que produz dados.
 */
class OndeToHundredStream extends Readable {
  index = 1; // Inicializa o contador em 1.

  // Método obrigatório `_read` para produzir dados.
  _read() {
    const i = this.index++; // Incrementa o contador.

    // Simula um atraso de 1 segundo para cada número.
    setTimeout(() => {
      if (i > 100) {
        // Quando o número excede 100, o fluxo é finalizado enviando `null`.
        this.push(null);
      } else {
        // Converte o número para um buffer e o adiciona ao fluxo.
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 1000);
  }
}

/**
 * @class InverseNumberStream
 * Classe que transforma os números recebidos, invertendo seu sinal.
 * Estende a classe `Transform`, permitindo modificar dados enquanto eles fluem.
 */
class InverseNumberStream extends Transform {
  // Método obrigatório `_transform` para transformar os chunks recebidos.
  _transform(chunk, encoding, callback) {
    // Converte o chunk para número, inverte o sinal e retorna o valor transformado.
    const transformed = Number(chunk.toString()) * -1;
    callback(null, Buffer.from(String(transformed))); // Envia o dado transformado.
  }
}

/**
 * @class MultiplyByTenStream
 * Classe que consome os dados recebidos e os multiplica por 10.
 * Estende a classe `Writable`, permitindo consumir e processar os dados no final do fluxo.
 */
class MultiplyByTenStream extends Writable {
  // Método obrigatório `_write` para processar os chunks recebidos.
  _write(chunk, encoding, callback) {
    // Converte o chunk para número, multiplica por 10 e exibe o resultado no console.
    console.log(Number(chunk.toString()) * 10);
    callback(); // Indica que o processamento foi concluído.
  }
}

// Criação e encadeamento dos fluxos:
// 1. `OndeToHundredStream` gera números de 1 a 100.
// 2. `InverseNumberStream` inverte o sinal dos números gerados.
// 3. `MultiplyByTenStream` multiplica os números resultantes por 10 e exibe no console.
new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());

/**
 * Explicação sobre o encadeamento (pipe):
 * - `pipe()` é usado para conectar uma stream à próxima, criando um fluxo contínuo de dados.
 * - Os dados fluem automaticamente da primeira stream (Readable) para a última (Writable),
 * passando por todas as streams intermediárias (Transform) para serem processados.
 *
 * Resultado esperado:
 * - O console exibirá os números de -10 a -1000 em incrementos de 10, gerados em intervalos de 1 segundo.
 */
