const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * /users/cadastro:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/cadastro", userController.signup);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /users/follow:
 *   put:
 *     summary: Follow another user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               followId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User followed successfully
 *       500:
 *         description: Server error
 */
router.put("/users/follow", userController.followUser);

/**
 * @swagger
 * /users/unfollow:
 *   put:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               unfollowId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       500:
 *         description: Server error
 */
router.put("/users/unfollow", userController.unfollowUser);

module.exports = router;