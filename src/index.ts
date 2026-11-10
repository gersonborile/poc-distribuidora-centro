import { app } from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`PoC Distribuidora Centro escuchando en http://localhost:${PORT}`);
});
