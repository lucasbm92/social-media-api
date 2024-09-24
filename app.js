require("dotenv").config();
const express = require("express");
const app = express();
const userController = require("./controllers/userController");

// Importação de rotas
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

app.use(express.json());

// Conexão com o banco de dados
const connectDB = require("./database");

async function startServer() {
  try {
    await connectDB(); // Aguarda a conexão com o banco de dados

    // Rotas
    app.use("/users", userRoutes);
    app.use("/posts", postRoutes, postRoutes); // Protege as rotas post

    // Outras rotas e middleware aqui

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Encerra o processo com um código de erro
  }
}

startServer();
