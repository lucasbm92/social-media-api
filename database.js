require("dotenv").config();
const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = "lukesocialmedia";

async function conectar() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
  }
  const db = client.db(dbName);
  return db;
}

module.exports = conectar;
