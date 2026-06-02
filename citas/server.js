const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'citas.json');

app.use(cors());
app.use(express.json());

function leerDatos() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function guardarDatos(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  const data = leerDatos();
  res.json(data);
});

app.get('/:id', (req, res) => {
  const data = leerDatos();
  const item = data.find(d => d.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Cita no encontrada' });
  res.json(item);
});

app.post('/', (req, res) => {
  const data = leerDatos();
  const nueva = {
    id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
    idCliente: req.body.idCliente,
    fecha: req.body.fecha,
    hora: req.body.hora,
    medico: req.body.medico,
    motivo: req.body.motivo,
    estado: req.body.estado || 'pendiente'
  };
  data.push(nueva);
  guardarDatos(data);
  res.status(201).json(nueva);
});

app.put('/:id', (req, res) => {
  const data = leerDatos();
  const idx = data.findIndex(d => d.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Cita no encontrada' });
  data[idx] = { ...data[idx], ...req.body, id: data[idx].id };
  guardarDatos(data);
  res.json(data[idx]);
});

app.delete('/:id', (req, res) => {
  const data = leerDatos();
  const idx = data.findIndex(d => d.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Cita no encontrada' });
  const eliminado = data.splice(idx, 1);
  guardarDatos(data);
  res.json(eliminado[0]);
});

app.listen(PORT, () => {
  console.log(`Servicio de Citas escuchando en http://localhost:${PORT}`);
});
