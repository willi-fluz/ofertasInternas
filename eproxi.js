const express = require('express');
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();

const PORT = 3001;
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwt3jaxJiP7vy_4Oo48UEbktjrTEghUtVMSdhflefmLF9Gg_t0noDqz6FeRIo3BOQl/exec';
// const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZIQe3LFcqlesEXmD7FOQXwJTqSK7QgW-2xY0H6nA/dev';

app.use(express.text({ limit: '5mb' })); // Para aceptar text/plain

// Middleware CORS para aceptar llamadas desde localhost
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // O ajusta según necesites
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Ruta que recibe y reenvía la petición
app.post('/', async (req, res) => {
  try {
    console.log('capturando petición...');
    fs.writeFileSync('peticion.json', req.body);
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: req.body
    });
    // console.log('Esto llega desde el cuerpo');
    // console.log(req.body);
    const texto = await response.text();
    // console.log('El servidor responde:');
    // console.log(JSON.stringify(response));
    res.status(200).send(texto);
  } catch (error) {
    console.error('Error al redirigir:', error);
    res.status(500).send('Error al redirigir al Apps Script');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor puente corriendo en http://localhost:${PORT}`);
});
