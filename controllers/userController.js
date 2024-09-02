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

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).send({ mensagem: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).send({ mensagem: "Email ou senha incorretos" });
    }

    res.status(200).send({ mensagem: "Login bem-sucedido", userId: user._id });
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
