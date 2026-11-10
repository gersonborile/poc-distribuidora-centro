// Datos SIMULADOS en memoria (la PoC no usa base de datos).
// En el sistema completo esto sería la tabla "producto" en PostgreSQL vía TypeORM.

export interface Producto {
  id: number;
  nombre: string;
  precio: number; // ARS por unidad
  stock: number; // unidades disponibles
}

export const productos: Producto[] = [
  { id: 1, nombre: "Aceite de girasol 900 ml", precio: 2400, stock: 120 },
  { id: 2, nombre: "Yerba mate 1 kg", precio: 4100, stock: 60 },
  { id: 3, nombre: "Fideos tirabuzón 500 g", precio: 1250, stock: 200 },
  { id: 4, nombre: "Azúcar 1 kg", precio: 1500, stock: 0 },
  { id: 5, nombre: "Harina 000 1 kg", precio: 980, stock: 15 },
];

export function buscarProducto(id: number): Producto | undefined {
  return productos.find((p) => p.id === id);
}
