// controllers/userController.js
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Ajuste o caminho conforme necessário

exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      usuario: req.body.usuario,
      email: req.body.email,
      password: hashedPassword,
    });
    const newUser = await user.save();
    res.status(201).json({ message: "Usuário criado com sucesso!", newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar usuário", error: error.message });
  }
};

// controllers/userController.js
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Autenticação falhou" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Autenticação falhou" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "SEGREDO", // Use uma chave secreta real aqui
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Autenticado com sucesso", token });
  } catch (error) {
    res.status(500).json({ message: "Erro interno", error: error.message });
  }
};
