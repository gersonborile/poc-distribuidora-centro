# PoC Distribuidora Centro — validación de disponibilidad

Prueba de Concepto del Grupo 6 (Construcción de Sitios Web II, IRESM 2026).
Escenario: plataforma de pedidos B2B para una distribuidora regional de Córdoba.

La PoC demuestra una sola funcionalidad: **validar si hay stock suficiente de un producto para una cantidad solicitada.**

## Datos

**Simulados y almacenados en memoria** (`src/data/productos.ts`). No hay base de datos: al reiniciar el servidor los datos vuelven a su estado inicial. En el sistema completo estos datos vivirían en PostgreSQL, accedidos con TypeORM.

## Cómo ejecutarla

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

El servidor queda en `http://localhost:3000` (se puede cambiar con la variable `PORT`).

Para compilar y correr la versión de producción: `npm run build` y luego `npm start`.

## Endpoint

### `GET /productos/:id/disponibilidad?cantidad=N`

Indica si la cantidad `N` del producto `:id` se puede confirmar.

**Regla de negocio:** no se puede confirmar una cantidad superior al stock disponible.

**Ejemplo con stock suficiente**

```
GET /productos/1/disponibilidad?cantidad=10
```

```json
// 200 OK
{
  "productoId": 1,
  "nombre": "Aceite de girasol 900 ml",
  "cantidadSolicitada": 10,
  "stockDisponible": 120,
  "disponible": true,
  "faltante": 0,
  "mensaje": "Cantidad disponible: se puede confirmar."
}
```

**Ejemplo con stock insuficiente**

```
GET /productos/5/disponibilidad?cantidad=20
```

```json
// 200 OK
{
  "productoId": 5,
  "nombre": "Harina 000 1 kg",
  "cantidadSolicitada": 20,
  "stockDisponible": 15,
  "disponible": false,
  "faltante": 5,
  "mensaje": "Stock insuficiente: faltan 5 unidades."
}
```

La consulta responde `200` en ambos casos: que no haya stock es un resultado válido de la consulta, no un error.

**Errores**

| Caso | Código | Ejemplo de respuesta |
|---|---|---|
| `id` no numérico o no positivo | 400 | `{"error": "El id del producto debe ser un entero positivo."}` |
| `cantidad` ausente, cero, negativa o no entera | 400 | `{"error": "El parámetro 'cantidad' es obligatorio y debe ser un entero positivo."}` |
| Producto inexistente | 404 | `{"error": "No existe un producto con id 99."}` |

## Cómo se lee la URL

Ejemplo: `/productos/1/disponibilidad?cantidad=10`

| Parte | Qué es |
|---|---|
| `/productos` | El recurso: la lista de productos |
| `/1` | El **id** del producto (parámetro de ruta, `req.params.id`) |
| `/disponibilidad` | Lo que se consulta sobre ese producto |
| `?` | Separa la ruta de los parámetros de consulta |
| `cantidad=10` | Parámetro de consulta (`req.query.cantidad`): la cantidad a verificar |

Lo que va **antes** de la `?` identifica qué recurso es (el producto 1). Lo que va **después** son opciones de la consulta, escritas como `nombre=valor` y unidas con `&` si hubiera más de una.

Leída completa: «del producto 1, decime la disponibilidad para una cantidad de 10».

## URLs para probar (Postman / Thunder Client)

Con el servidor corriendo (`npm run dev`), todas son peticiones `GET`:

| Qué muestra | URL | Resultado |
|---|---|---|
| Hay stock | `http://localhost:3000/productos/1/disponibilidad?cantidad=10` | 200, `disponible: true` |
| No alcanza el stock | `http://localhost:3000/productos/5/disponibilidad?cantidad=20` | 200, `disponible: false` |
| Producto sin stock | `http://localhost:3000/productos/4/disponibilidad?cantidad=1` | 200, `disponible: false` |
| Producto inexistente | `http://localhost:3000/productos/99/disponibilidad?cantidad=1` | 404 |
| Falta la cantidad | `http://localhost:3000/productos/1/disponibilidad` | 400 |
| Cantidad inválida | `http://localhost:3000/productos/1/disponibilidad?cantidad=0` | 400 |
| Id inválido | `http://localhost:3000/productos/abc/disponibilidad?cantidad=1` | 400 |

## Productos de prueba

| id | Producto | Stock |
|---|---|---|
| 1 | Aceite de girasol 900 ml | 120 |
| 2 | Yerba mate 1 kg | 60 |
| 3 | Fideos tirabuzón 500 g | 200 |
| 4 | Azúcar 1 kg | 0 |
| 5 | Harina 000 1 kg | 15 |

## Estructura

```
src/
  index.ts                     arranque del servidor
  app.ts                       configuración de Express (separada para poder probarla con Supertest)
  data/productos.ts            datos simulados en memoria
  services/disponibilidad.ts   regla de negocio (función pura, probable con Jest)
  routes/productos.routes.ts   endpoint y validación de parámetros
```

## Persistencia propuesta (PostgreSQL + TypeORM)

Entidad `Producto` con las columnas `id`, `nombre`, `precio` y `stock`. El endpoint reemplazaría `buscarProducto` por una consulta al repositorio de TypeORM; la regla de negocio en `services/disponibilidad.ts` no cambiaría.

## Qué falta para una aplicación completa

- Base de datos real y migraciones.
- Autenticación de clientes y control de acceso (los datos comerciales deben estar protegidos).
- Alta de pedidos que **descuente el stock** de forma atómica (transacción) para evitar que dos clientes compren el mismo stock a la vez.
- Catálogo (listado y búsqueda de productos), carrito y gestión de pedidos.
- Frontend.
- Pruebas automatizadas, manejo centralizado de errores, logs y despliegue.
