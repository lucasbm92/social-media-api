const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // Ajuste o caminho conforme necessário

// Rotas para posts
router.post("/", postController.criarPostagem);
router.get("/", postController.lerPostagens);
router.put("/:id", postController.atualizarPostagem);
router.delete("/:id", postController.deletarPostagem);

// Rotas para curtidas e comentários
router.post("/:postId/like", postController.likePost);
router.post("/:postId/unlike", postController.unlikePost);
router.post("/:postId/comments", postController.addComment);
router.delete("/:postId/comments/:commentId", postController.removeComment);

module.exports = router;
