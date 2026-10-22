const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

app.use(express.json());

// Hacer que la carpeta 'public' sea de acceso público
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de PostgreSQL con Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ruta de prueba para el estado de la base de datos
app.get('/api/estado', async (req, res) => {
  try {
    const client = await pool.connect();
    res.json({ estado: 'Conexión activa y funcionando correctamente con PostgreSQL' });
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar a la base de datos', detalle: err.message });
  }
});

// Rutas para manejar las tareas (ejemplo para guardar y consultar)
app.get('/api/tareas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas'); // O la tabla que utilices
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar las tareas', detalle: err.message });
  }
});

app.post('/api/tareas', async (req, res) => {
  const { nombre } = req.body;
  try {
    const query = 'INSERT INTO tareas (nombre) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [nombre]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la tarea', detalle: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de elda corriendo en el puerto ${PORT}`);
});