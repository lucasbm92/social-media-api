const bcrypt = require("bcrypt");
const conectarDB = require("../database"); // Ajuste o caminho conforme necessário

exports.signup = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .send({ mensagem: "Todos os campos são obrigatórios" });
    }

    // Gera um salt e hash para a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const db = await conectarDB();
    const collection = db.collection("users");

    const novoUsuario = {
      nome,
      email,
      senha: hashedPassword,
      dataCriacao: new Date(),
    };

    const resultado = await collection.insertOne(novoUsuario);
    const usuarioCriado = await collection.findOne({
      _id: resultado.insertedId,
    });

    res.status(201).send({
      mensagem: "Usuário criado com sucesso",
      usuario: usuarioCriado,
    });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao criar usuário", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .send({ mensagem: "Todos os campos são obrigatórios" });
    }

    const db = await conectarDB();
    const collection = db.collection("users");

    const usuario = await collection.findOne({ email });
    if (!usuario) {
      return res.status(400).send({ mensagem: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).send({ mensagem: "Senha inválida" });
    }

    res.status(200).send({ mensagem: "Login bem-sucedido" });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao fazer login", error: error.message });
  }
};
