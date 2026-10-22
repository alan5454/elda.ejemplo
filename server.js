
const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

app.get("/api/estado", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ conectado: true });
  } catch (error) {
    console.error("Error de base de datos:", error.message);
    res.status(500).json({ conectado: false });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
