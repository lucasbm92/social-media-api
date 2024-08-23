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

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const db = await conectarDB();
    const collection = db.collection("posts");

    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: userId } }
    );

    res.status(200).send({ mensagem: "Post curtido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao curtir post", error: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const db = await conectarDB();
    const collection = db.collection("posts");

    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId } }
    );

    res.status(200).send({ mensagem: "Post descurtido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao descurtir post", error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, comentario } = req.body;

    const db = await conectarDB();
    const collection = db.collection("posts");

    const novoComentario = {
      userId,
      comentario,
      dataComentario: new Date(),
    };

    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: novoComentario } }
    );

    res.status(200).send({ mensagem: "Comentário adicionado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao adicionar comentário", error: error.message });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const db = await conectarDB();
    const collection = db.collection("posts");

    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );

    res.status(200).send({ mensagem: "Comentário removido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao remover comentário", error: error.message });
  }
};
