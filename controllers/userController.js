const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      return res.status(401).send({ mensagem: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).send({ mensagem: "Email ou senha incorretos" });
    }

    const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.header("Authorization", `Bearer ${token}`).send({
      mensagem: "Login bem-sucedido",
      token,
    });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao fazer login", error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { userId, followId } = req.body;

    const db = await conectarDB();
    const collection = db.collection("users");

    // Adicionar o followId à lista de following do userId
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { following: followId } }
    );

    // Adicionar o userId à lista de followers do followId
    await collection.updateOne(
      { _id: new ObjectId(followId) },
      { $addToSet: { followers: userId } }
    );

    res.status(200).send({ mensagem: "Usuário seguido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao seguir usuário", error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId, unfollowId } = req.body;

    const db = await conectarDB();
    const collection = db.collection("users");

    // Remover o unfollowId da lista de following do userId
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { following: unfollowId } }
    );

    // Remover o userId da lista de followers do unfollowId
    await collection.updateOne(
      { _id: new ObjectId(unfollowId) },
      { $pull: { followers: userId } }
    );

    res
      .status(200)
      .send({ mensagem: "Usuário deixou de ser seguido com sucesso" });
  } catch (error) {
    res.status(500).send({
      mensagem: "Erro ao deixar de seguir usuário",
      error: error.message,
    });
  }
};
