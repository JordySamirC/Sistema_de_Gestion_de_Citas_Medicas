# Sistema de Gestión de Citas Médicas

Arquitectura de microservicios con Node.js para la gestión descentralizada de citas médicas. Cada servicio opera de forma independiente con su propio puerto y almacenamiento JSON.

## Microservicios

| Servicio | Puerto | Descripción | Datos |
|---|---|---|---|
| **Clientes** | 3000 | CRUD de pacientes | `clientes.json` |
| **Citas** | 3001 | Programación, modificación y cancelación de citas | `citas.json` |
| **Facturación** | 3002 | Generación y gestión de facturas | `facturacion.json` |

## Arquitectura

```
Frontend (Bootstrap 5)
    |
    ├── http://localhost:3000 ── Servicio Clientes
    ├── http://localhost:3001 ── Servicio Citas
    └── http://localhost:3002 ── Servicio Facturación
```

- Cada microservicio se ejecuta en su propio proceso
- Comunicación vía APIs REST
- Persistencia en archivos JSON por servicio
- CORS habilitado para peticiones desde el frontend

## Requisitos

- Node.js 18+
- npm

## Ejecución

Abrir tres terminales:

```bash
# Terminal 1 - Clientes
cd clientes
npm install
node server.js

# Terminal 2 - Citas
cd citas
npm install
node server.js

# Terminal 3 - Facturación
cd facturacion
npm install
node server.js
```

Verificar que los tres servicios estén activos:

```
Servicio de Clientes escuchando en http://localhost:3000
Servicio de Citas escuchando en http://localhost:3001
Servicio de Facturación escuchando en http://localhost:3002
```

## Endpoints

Cada servicio expone los mismos endpoints REST:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Obtener todos los registros |
| `GET` | `/:id` | Obtener registro por ID |
| `POST` | `/` | Crear nuevo registro |
| `PUT` | `/:id` | Actualizar registro |
| `DELETE` | `/:id` | Eliminar registro |

## Modelos de Datos

```json
// Cliente
{ "id": 1, "nombre": "...", "email": "...", "telefono": "...", "fechaRegistro": "2026-06-01" }

// Cita
{ "id": 1, "idCliente": 1, "fecha": "2026-06-15", "hora": "10:30", "medico": "...", "motivo": "...", "estado": "pendiente" }

// Factura
{ "id": 1, "idCita": 1, "monto": 150.00, "fechaEmision": "2026-06-01", "pagado": false }
```
