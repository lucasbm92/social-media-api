const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // Ajuste o caminho conforme necessário

router.post("/", postController.criarPostagem);
router.get("/", postController.lerPostagens);
router.put("/:id", postController.atualizarPostagem);
router.delete("/:id", postController.deletarPostagem);
router.post("/posts/:postId/like", userController.likePost);
router.post("/posts/:postId/unlike", userController.unlikePost);
router.post("/posts/:postId/comments", userController.addComment);
router.delete(
  "/posts/:postId/comments/:commentId",
  userController.removeComment
);

module.exports = router;
