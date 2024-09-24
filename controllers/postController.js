const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const conectarDB = require("../database"); // Ajuste o caminho conforme necessário

exports.criarPostagem = async (req, res) => {
  try {
    const { titulo, conteudo } = req.body; 
    const autor = req.user._id; // Recebe o ID de usuário do token

    const db = await conectarDB();
    const postsCollection = db.collection("posts");

    const novaPostagem = {
      titulo,
      conteudo,
      autor,
      dataCriacao: new Date(),
      likes: [],
      comments: [],
    };

    await postsCollection.insertOne(novaPostagem);

    res.status(201).send({
      mensagem: "Postagem criada com sucesso",
      postagem: novaPostagem,
    });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao criar postagem", error: error.message });
  }
};

exports.lerPostagens = async (req, res) => {
  try {
    const userId = req.user._id; // Recebe o ID de usuário do token

    const db = await conectarDB();
    const collection = db.collection("posts");

    // Encontra as postagens do usuário logado
    const postagens = await collection.find({ autor: userId }).toArray();

    res.status(200).send(postagens);
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao buscar postagens", error: error.message });
  }
};

exports.atualizarPostagem = async (req, res) => {
  try {
    const userId = req.user._id; // Recebe o ID de usuário do token

    const db = await conectarDB();
    const collection = db.collection("posts");

    // Checa se a postagem existe e pertence ao usuário
    const post = await collection.findOne({ _id: ObjectId(req.params.id) });
    if (!post || post.autor !== userId) {
      return res.status(403).send({ mensagem: "Acesso negado" });
    }

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
    const userId = req.user._id; // Recebe o ID de usuário do token

    const db = await conectarDB();
    const collection = db.collection("posts");

    // Checa se a postagem existe e pertence ao usuário
    const post = await collection.findOne({ _id: ObjectId(req.params.id) });
    if (!post || post.autor !== userId) {
      return res.status(403).send({ mensagem: "Acesso negado" });
    }

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
    const userId = req.user._id; // Recebe o ID de usuário do token

    const { postId } = req.params;

    const db = await conectarDB();
    const collection = db.collection("posts");

    // Adiciona o ID do usuário ao array de likes
    const resultado = await collection.updateOne(
      { _id: ObjectId(postId) },
      { $addToSet: { likes: userId } }
    );

    res.status(200).send({ mensagem: "Postagem curtida com sucesso", resultado });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao curtir postagem", error: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const userId = req.user._id; // Recebe o ID de usuário do token

    const { postId } = req.params;

    const db = await conectarDB();
    const collection = db.collection("posts");

    // Remove o ID do usuário do array de likes
    const resultado = await collection.updateOne(
      { _id: ObjectId(postId) },
      { $pull: { likes: userId } }
    );

    res.status(200).send({ mensagem: "Postagem descurtida com sucesso", resultado });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao descurtir postagem", error: error.message });
  }
};
exports.addComment = async (req, res) => {
  try {
    const userId = req.user._id; // Recebe o ID de usuário do token

    const { postId } = req.params;
    const { texto } = req.body;

    const db = await conectarDB();
    const collection = db.collection("posts");

    const comentario = {
      autor: userId,
      texto,
      dataCriacao: new Date(),
    };

    // Adiciona o comentário ao array de comentários
    const resultado = await collection.updateOne(
      { _id: ObjectId(postId) },
      { $push: { comments: comentario } }
    );

    res.status(200).send({ mensagem: "Comentário adicionado com sucesso", resultado });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao adicionar comentário", error: error.message });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const userId = req.user._id; // Recebe o ID de usuário do token

    const { postId, commentId } = req.params;

    const db = await conectarDB();
    const collection = db.collection("posts");

    // Checa se o comentário existe e pertence ao usuário
    const post = await collection.findOne({ _id: ObjectId(postId) });
    const comment = post.comments.find(comment => comment._id.equals(ObjectId(commentId)));

    if (!comment || comment.autor !== userId) {
      return res.status(403).send({ mensagem: "Acesso negado" });
    }

    // Remove o comentário do array de comentários
    const resultado = await collection.updateOne(
      { _id: ObjectId(postId) },
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );

    res.status(200).send({ mensagem: "Comentário removido com sucesso", resultado });
  } catch (error) {
    res
      .status(500)
      .send({ mensagem: "Erro ao remover comentário", error: error.message });
  }
};
