const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const server = express();

server.use(morgan("dev"));
server.use(cors());

// Configura el límite del tamaño del cuerpo de la solicitud aquí
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

server.use(router);
server.use(express.static(path.join(__dirname, "public")));

module.exports = server;
