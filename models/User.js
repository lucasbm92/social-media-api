// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: false },
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  // Adicione outros campos conforme necessário (por exemplo, foto de perfil, biografia, etc.)
});

const User = mongoose.model("User", userSchema);

module.exports = User;
