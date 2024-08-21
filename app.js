const express = require("express");
const app = express();

// Importação de rotas
const userRoutes = require("./routes/userRoutes"); // Ajuste o caminho conforme necessário
const postRoutes = require("./routes/postRoutes");

app.use(express.json());

// Conexão com o banco de dados
const connectDB = require("./database"); // Ajuste o caminho conforme necessário

async function startServer() {
  try {
    await connectDB(); // Aguarda a conexão com o banco de dados
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    // Rotas
    app.use("/users", userRoutes);
    app.use("/posts", postRoutes);

    // Defina outras rotas e middleware aqui

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Encerra o processo com um código de erro
  }
}

startServer();
