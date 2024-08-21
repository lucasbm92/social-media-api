const conectarDB = require("../database"); // Ajuste o caminho conforme necessário
const { ObjectId } = require("mongodb");

exports.criarPostagem = async (req, res) => {
  try {
    const db = await conectarDB();
    const collection = db.collection("posts");
    const resultado = await collection.insertOne(req.body);
    res.status(201).send(resultado);
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao criar postagem", error: error.message });
  }
};

exports.lerPostagens = async (req, res) => {
  try {
    const db = await conectarDB();
    const collection = db.collection("posts");
    const postagens = await collection.find().toArray();
    res.status(200).send(postagens);
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao buscar postagens", error: error.message });
  }
};

exports.atualizarPostagem = async (req, res) => {
  try {
    const db = await conectarDB();
    const collection = db.collection("posts");
    const resultado = await collection.updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.status(200).send(resultado);
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao atualizar postagem", error: error.message });
  }
};

exports.deletarPostagem = async (req, res) => {
  try {
    const db = await conectarDB();
    const collection = db.collection("posts");
    const resultado = await collection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.status(204).send(resultado);
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao deletar postagem", error: error.message });
  }
};
