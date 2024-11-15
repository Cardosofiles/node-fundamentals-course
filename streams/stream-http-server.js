import http from "node:http";
import { Transform } from "stream";

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;
    console.log(transformed);
    callback(null, Buffer.from(String(transformed)));
  }
}

/**
 * require (req) => ReadableStream
 * response (res) => WritableStream
 */

const server = http.createServer((req, res) => {
  return req.pipe(new InverseNumberStream()).pipe(res);
});

server.listen(3334, () => {
  console.log("Server is running on port 3334");
});
