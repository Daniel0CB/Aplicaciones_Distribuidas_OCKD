require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

app.use(express.json());

let client;
let db;
let proyectosCollection;

async function connectDB() {
  const uri = "mongodb+srv://kdocdany_db_user:lBlUz597KFx5jQwG@cluster0.u4w7qod.mongodb.net/?appName=Cluster0";
  client = new MongoClient(uri);
  await client.connect();
  
  db = client.db("AplicacionesDistribuidas");
  proyectosCollection = db.collection("Proyectos");
}

app.post("/proyectos/seed", async (req, res) => {
  const misProyectos = [
    {
      id_Interno: "INT-001",
      id_Externo: "EXT-01",
      nombre: "Sistema de Inventarios",
      autor: "Kevin Ortiz",
      prioridad: "media",
      presupuesto: 5000
    },
    {
      id_Interno: "INT-002",
      id_Externo: "EXT-02",
      nombre: "App Movil Turismo",
      autor: "Daniel Campos",
      prioridad: "Alta",
      presupuesto: 12000
    },
    {
      id_Interno: "INT-003",
      id_Externo: "EXT-003",
      nombre: "App Cliente Servidor",
      autor: "Carlos Ruiz",
      prioridad: "Alta",
      presupuesto: 8500
    },
    {
      id_Interno: "INT-004",
      id_Externo: "EXT-004",
      nombre: "La Manzanita",
      autor: "Ana Lopez",
      prioridad: "Baja",
      presupuesto: 3200
    },
    {
      id_Interno: "INT-005",
      id_Externo: "EXT-005",
      nombre: "API Gateway Seguridad",
      autor: "Sofia Marín",
      prioridad: "Critica",
      presupuesto: 15000
    }
  ];

  try {
    const result = await proyectosCollection.insertMany(misProyectos);
    res.json({
      mensaje: "Proyectos insertados correctamente",
      cantidad: result.insertedCount,
      ids: result.insertedIds
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, async () => {
  console.log("Servidor corriendo en el puerto 3000");
  await connectDB();
  console.log("Conectado a MongoDB: AplicacionesDistribuidas -> Proyectos");
});