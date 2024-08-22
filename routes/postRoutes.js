const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // Ajuste o caminho conforme necessário

router.post("/", postController.criarPostagem);
router.get("/", postController.lerPostagens);
router.put("/:id", postController.atualizarPostagem);
router.delete("/:id", postController.deletarPostagem);

module.exports = router;
