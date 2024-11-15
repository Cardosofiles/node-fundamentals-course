import { Readable } from "stream";

class OndeToHundredStream extends Readable {
  constructor() {
    super();
    this.index = 1;
  }
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
      1;
    }, 1000);
  }
}

fetch("http://localhost:3334", {
  method: "POST",
  body: new OndeToHundredStream(),
  duplex: "half",
  headers: {
    "Content-Type": "application/octet-stream",
  },
})
  .then((res) => {
    console.log(`Código rodou, response status: ${res.status}`);
  })
  .catch((err) => {
    console.log(`Response error: ${err.message}`);
  });
