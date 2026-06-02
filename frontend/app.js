const URLS = {
  clientes: 'http://localhost:3000',
  citas: 'http://localhost:3001',
  facturacion: 'http://localhost:3002'
};

document.addEventListener('DOMContentLoaded', () => {
  cargarTodo();
});

function cargarTodo() {
  cargarClientes();
  cargarCitas();
  cargarFacturacion();
}

async function cargarClientes() {
  try {
    const res = await fetch(URLS.clientes);
    const data = await res.json();
    const tbody = document.querySelector('#tablaClientes tbody');
    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.nombre}</td><td>${c.email}</td>
        <td>${c.telefono}</td><td>${c.fechaRegistro}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarCliente(${c.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${c.id})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Error al cargar clientes:', e);
  }
}

function abrirModalCliente() {
  document.getElementById('clienteId').value = '';
  document.getElementById('clienteNombre').value = '';
  document.getElementById('clienteEmail').value = '';
  document.getElementById('clienteTelefono').value = '';
  new bootstrap.Modal(document.getElementById('modalCliente')).show();
}

async function editarCliente(id) {
  try {
    const res = await fetch(`${URLS.clientes}/${id}`);
    const c = await res.json();
    document.getElementById('clienteId').value = c.id;
    document.getElementById('clienteNombre').value = c.nombre;
    document.getElementById('clienteEmail').value = c.email;
    document.getElementById('clienteTelefono').value = c.telefono;
    new bootstrap.Modal(document.getElementById('modalCliente')).show();
  } catch (e) {
    console.error('Error al editar cliente:', e);
  }
}

async function guardarCliente() {
  const id = document.getElementById('clienteId').value;
  const body = {
    nombre: document.getElementById('clienteNombre').value,
    email: document.getElementById('clienteEmail').value,
    telefono: document.getElementById('clienteTelefono').value
  };
  try {
    if (id) {
      await fetch(`${URLS.clientes}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch(URLS.clientes, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
    cargarClientes();
  } catch (e) {
    console.error('Error al guardar cliente:', e);
  }
}

async function eliminarCliente(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  try {
    await fetch(`${URLS.clientes}/${id}`, { method: 'DELETE' });
    cargarClientes();
  } catch (e) {
    console.error('Error al eliminar cliente:', e);
  }
}

async function cargarCitas() {
  try {
    const [resCitas, resClientes] = await Promise.all([
      fetch(URLS.citas),
      fetch(URLS.clientes)
    ]);
    const citas = await resCitas.json();
    const clientes = await resClientes.json();
    const clientesMap = Object.fromEntries(clientes.map(c => [c.id, c.nombre]));
    const tbody = document.querySelector('#tablaCitas tbody');
    tbody.innerHTML = citas.map(c => `
      <tr>
        <td>${clientesMap[c.idCliente] || '?'}</td>
        <td>${c.fecha}</td><td>${c.hora}</td><td>${c.medico}</td>
        <td>${c.motivo}</td>
        <td><span class="badge bg-${c.estado === 'confirmada' ? 'success' : c.estado === 'cancelada' ? 'danger' : c.estado === 'completada' ? 'secondary' : 'warning'}">${c.estado}</span></td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarCita(${c.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarCita(${c.id})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Error al cargar citas:', e);
  }
}

async function abrirModalCita() {
  document.getElementById('citaId').value = '';
  document.getElementById('citaFecha').value = '';
  document.getElementById('citaHora').value = '';
  document.getElementById('citaMedico').value = '';
  document.getElementById('citaMotivo').value = '';
  document.getElementById('citaEstado').value = 'pendiente';
  const select = document.getElementById('citaIdCliente');
  try {
    const res = await fetch(URLS.clientes);
    const clientes = await res.json();
    select.innerHTML = clientes.map(c => `<option value="${c.id}">${c.id} - ${c.nombre}</option>`).join('');
  } catch (e) {
    console.error('Error al cargar clientes:', e);
  }
  new bootstrap.Modal(document.getElementById('modalCita')).show();
}

async function editarCita(id) {
  try {
    const [resCita, resClientes] = await Promise.all([
      fetch(`${URLS.citas}/${id}`),
      fetch(URLS.clientes)
    ]);
    const c = await resCita.json();
    const clientes = await resClientes.json();
    document.getElementById('citaId').value = c.id;
    document.getElementById('citaIdCliente').innerHTML = clientes.map(cl => `<option value="${cl.id}" ${cl.id === c.idCliente ? 'selected' : ''}>${cl.id} - ${cl.nombre}</option>`).join('');
    document.getElementById('citaFecha').value = c.fecha;
    document.getElementById('citaHora').value = c.hora;
    document.getElementById('citaMedico').value = c.medico;
    document.getElementById('citaMotivo').value = c.motivo;
    document.getElementById('citaEstado').value = c.estado;
    new bootstrap.Modal(document.getElementById('modalCita')).show();
  } catch (e) {
    console.error('Error al editar cita:', e);
  }
}

async function guardarCita() {
  const id = document.getElementById('citaId').value;
  const body = {
    idCliente: parseInt(document.getElementById('citaIdCliente').value),
    fecha: document.getElementById('citaFecha').value,
    hora: document.getElementById('citaHora').value,
    medico: document.getElementById('citaMedico').value,
    motivo: document.getElementById('citaMotivo').value,
    estado: document.getElementById('citaEstado').value
  };
  try {
    if (id) {
      await fetch(`${URLS.citas}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch(URLS.citas, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    bootstrap.Modal.getInstance(document.getElementById('modalCita')).hide();
    cargarCitas();
  } catch (e) {
    console.error('Error al guardar cita:', e);
  }
}

async function eliminarCita(id) {
  if (!confirm('¿Eliminar esta cita?')) return;
  try {
    await fetch(`${URLS.citas}/${id}`, { method: 'DELETE' });
    cargarCitas();
  } catch (e) {
    console.error('Error al eliminar cita:', e);
  }
}

async function cargarFacturacion() {
  try {
    const res = await fetch(URLS.facturacion);
    const data = await res.json();
    const tbody = document.querySelector('#tablaFacturacion tbody');
    tbody.innerHTML = data.map(f => `
      <tr>
        <td>${f.idCita}</td>
        <td>S/ ${f.monto.toFixed(2)}</td><td>${f.fechaEmision}</td>
        <td><span class="badge bg-${f.pagado ? 'success' : 'danger'}">${f.pagado ? 'Sí' : 'No'}</span></td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarFactura(${f.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarFactura(${f.id})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Error al cargar facturas:', e);
  }
}

function abrirModalFactura() {
  document.getElementById('facturaId').value = '';
  document.getElementById('facturaIdCita').value = '';
  document.getElementById('facturaMonto').value = '';
  document.getElementById('facturaPagado').value = 'false';
  new bootstrap.Modal(document.getElementById('modalFactura')).show();
}

async function editarFactura(id) {
  try {
    const res = await fetch(`${URLS.facturacion}/${id}`);
    const f = await res.json();
    document.getElementById('facturaId').value = f.id;
    document.getElementById('facturaIdCita').value = f.idCita;
    document.getElementById('facturaMonto').value = f.monto;
    document.getElementById('facturaPagado').value = f.pagado.toString();
    new bootstrap.Modal(document.getElementById('modalFactura')).show();
  } catch (e) {
    console.error('Error al editar factura:', e);
  }
}

async function guardarFactura() {
  const id = document.getElementById('facturaId').value;
  const body = {
    idCita: parseInt(document.getElementById('facturaIdCita').value),
    monto: parseFloat(document.getElementById('facturaMonto').value),
    pagado: document.getElementById('facturaPagado').value === 'true'
  };
  try {
    if (id) {
      await fetch(`${URLS.facturacion}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch(URLS.facturacion, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    bootstrap.Modal.getInstance(document.getElementById('modalFactura')).hide();
    cargarFacturacion();
  } catch (e) {
    console.error('Error al guardar factura:', e);
  }
}

async function eliminarFactura(id) {
  if (!confirm('¿Eliminar esta factura?')) return;
  try {
    await fetch(`${URLS.facturacion}/${id}`, { method: 'DELETE' });
    cargarFacturacion();
  } catch (e) {
    console.error('Error al eliminar factura:', e);
  }
}
