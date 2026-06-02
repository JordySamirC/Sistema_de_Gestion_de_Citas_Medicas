const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'facturacion.json');

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
  if (!item) return res.status(404).json({ error: 'Factura no encontrada' });
  res.json(item);
});

app.post('/', (req, res) => {
  const data = leerDatos();
  const nueva = {
    id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
    idCita: req.body.idCita,
    monto: req.body.monto,
    fechaEmision: new Date().toISOString().split('T')[0],
    pagado: req.body.pagado || false
  };
  data.push(nueva);
  guardarDatos(data);
  res.status(201).json(nueva);
});

app.put('/:id', (req, res) => {
  const data = leerDatos();
  const idx = data.findIndex(d => d.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Factura no encontrada' });
  data[idx] = { ...data[idx], ...req.body, id: data[idx].id };
  guardarDatos(data);
  res.json(data[idx]);
});

app.delete('/:id', (req, res) => {
  const data = leerDatos();
  const idx = data.findIndex(d => d.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Factura no encontrada' });
  const eliminado = data.splice(idx, 1);
  guardarDatos(data);
  res.json(eliminado[0]);
});

app.listen(PORT, () => {
  console.log(`Servicio de Facturación escuchando en http://localhost:${PORT}`);
});
