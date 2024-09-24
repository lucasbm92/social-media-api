const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // Ajuste o caminho conforme necessário
const auth = require("../middleware/auth");

// Rotas para posts
router.post("/", auth, postController.criarPostagem);
router.get("/", auth, postController.lerPostagens);
router.put("/:id", auth, postController.atualizarPostagem);
router.delete("/:id", auth, postController.deletarPostagem);

// Rotas para curtidas e comentários
router.post("/:postId/like", auth, postController.likePost);
router.post("/:postId/unlike", auth, postController.unlikePost);
router.post("/:postId/comments", auth, postController.addComment);
router.delete("/:postId/comments/:commentId", auth, postController.removeComment);

module.exports = router;
