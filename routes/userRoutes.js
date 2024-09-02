// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Ajuste o caminho conforme necessário

router.post("/cadastro", userController.signup);
router.post("/login", userController.login);
router.put("/users/follow", userController.followUser);
router.put("/users/unfollow", userController.unfollowUser);

module.exports = router;
