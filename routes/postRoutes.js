const express = require("express");
const roteador = express.Router();
const controladorPostagem = require("../controllers/postController"); // Ajuste o caminho conforme necessário

roteador.post("/", controladorPostagem.criarPostagem);
roteador.get("/", controladorPostagem.lerPostagens);
roteador.put("/:id", controladorPostagem.atualizarPostagem);
roteador.delete("/:id", controladorPostagem.deletarPostagem);

module.exports = roteador;
