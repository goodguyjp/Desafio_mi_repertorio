const http = require("http");
const fs = require("fs");
const url = require("url");
const {
  agregarCancion,
  consultarCanciones,
  editarCancion,
  borrarCancion,
} = require("./consultas");
const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "admin",
  database: "repertorio",
  port: 5500,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
};
const pool = new Pool(config);

http
  .createServer((req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html");
      res.end(fs.readFileSync("index.html", "utf8"));
    }
    if (req.url.includes("/cancion") && req.method == "POST") {
      let body;
      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });
      req.on("end", () => {
        cancion = [body.cancion, body.artista, body.tono];
        agregarCancion(pool, cancion);
        res.end();
      });
    }
    
    if (req.url == "/canciones" && req.method == "GET") {
      consultarCanciones()
        .then((resu) => {
          res.end(JSON.stringify(resu));
        })
        .catch((err) => console.error(err));
    }

    if (req.url.includes("/cancion?") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;
      borrarCancion(pool, id)
      res.end();
    }

    if (req.url.includes("/cancion") && req.method == "PUT") {
      let body;
      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });
      req.on("end", () => {
        editar = [body.cancion, body.artista, body.tono, body.id];
        editarCancion(pool, editar);
        res.end();
      });
    }
  })
  .listen(3000, () => console.log("Escuchando el puerto 3000"));