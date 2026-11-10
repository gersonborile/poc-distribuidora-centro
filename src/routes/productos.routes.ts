import { Router } from "express";
import { buscarProducto } from "../data/productos";
import { validarDisponibilidad } from "../services/disponibilidad";

const router = Router();

// Convierte un texto en entero positivo; devuelve null si no lo es.
function enteroPositivo(valor: unknown): number | null {
  if (typeof valor !== "string" || !/^\d+$/.test(valor)) return null;
  const n = Number(valor);
  return n > 0 ? n : null;
}

// GET /productos/:id/disponibilidad?cantidad=N
router.get("/:id/disponibilidad", (req, res) => {
  const id = enteroPositivo(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "El id del producto debe ser un entero positivo." });
  }

  const cantidad = enteroPositivo(req.query.cantidad);
  if (cantidad === null) {
    return res
      .status(400)
      .json({ error: "El parámetro 'cantidad' es obligatorio y debe ser un entero positivo." });
  }

  const producto = buscarProducto(id);
  if (!producto) {
    return res.status(404).json({ error: `No existe un producto con id ${id}.` });
  }

  return res.status(200).json(validarDisponibilidad(producto, cantidad));
});

export default router;
