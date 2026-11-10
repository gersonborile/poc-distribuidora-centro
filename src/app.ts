import express from "express";
import productosRoutes from "./routes/productos.routes";

// Se separa la app del arranque del servidor para poder probarla con Supertest.
export const app = express();

app.use(express.json());
app.use("/productos", productosRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});
