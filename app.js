require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Importação de rotas
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Social Media API!");
});

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description: "API documentation for the Social Media API",
    },
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Conexão com o banco de dados
const connectDB = require("./database");

async function startServer() {
  try {
    await connectDB(); // Aguarda a conexão com o banco de dados

    // Rotas
    app.use("/users", userRoutes);
    app.use("/posts", postRoutes);

    // Outras rotas e middleware aqui

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Encerra o processo com um código de erro
  }
}

startServer();