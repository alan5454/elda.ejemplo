const express = require('express');
const { Pool } = require('pg');
const app = express();

// Middleware para entender JSON en las peticiones
app.use(express.json());

// Configuración de la conexión a PostgreSQL con la variable de entorno de Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras externas como Render
  }
});

// 1. Ruta para verificar el estado de la conexión
app.get('/api/estado', async (req, res) => {
  try {
    const client = await pool.connect();
    res.json({ estado: 'Conexión activa y funcionando correctamente con PostgreSQL' });
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar a la base de datos', detalle: err.message });
  }
});

// 2. Ruta POST para GUARDAR un registro (basado en la estructura de tu tabla)
app.post('/api/usuarios', async (req, res) => {
  const { name, email, id } = req.body;
  
  try {
    const query = 'INSERT INTO usuarios (name, email, id) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, id];
    
    const result = await pool.query(query, values);
    res.status(201).json({
      mensaje: '¡Dato guardado con éxito!',
      registro: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar en la base de datos', detalle: err.message });
  }
});

// 3. Ruta GET para CONSULTAR todos los registros guardados
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar los datos', detalle: err.message });
  }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de elda corriendo en el puerto ${PORT}`);
});