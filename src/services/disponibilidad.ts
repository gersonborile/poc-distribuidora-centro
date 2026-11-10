import { Producto } from "../data/productos";

export interface ResultadoDisponibilidad {
  productoId: number;
  nombre: string;
  cantidadSolicitada: number;
  stockDisponible: number;
  disponible: boolean;
  faltante: number;
  mensaje: string;
}

/**
 * Regla de negocio: no se puede confirmar una cantidad superior al stock disponible.
 * Función pura (sin Express ni datos globales) para poder probarla de forma aislada con Jest.
 */
export function validarDisponibilidad(
  producto: Producto,
  cantidad: number
): ResultadoDisponibilidad {
  const disponible = cantidad <= producto.stock;
  const faltante = disponible ? 0 : cantidad - producto.stock;

  return {
    productoId: producto.id,
    nombre: producto.nombre,
    cantidadSolicitada: cantidad,
    stockDisponible: producto.stock,
    disponible,
    faltante,
    mensaje: disponible
      ? "Cantidad disponible: se puede confirmar."
      : `Stock insuficiente: ${faltante === 1 ? "falta 1 unidad" : `faltan ${faltante} unidades`}.`,
  };
}
