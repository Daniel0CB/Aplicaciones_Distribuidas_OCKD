//Primera linea agregada para cambiar de servidores dns a los de google
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function iterateFunc(doc) {
   console.log(JSON.stringify(doc, null, 4));
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function findAllData(client) {
  const cursor = await client.db("sample_mflix").collection("movies").find({}).limit(2);
  // Convertir cursor a array de documentos
  const results = await cursor.toArray();
  console.log("Title: ",results[0]['title']);

  // Mostrar resultados
  console.log("Películas encontradas:");
  console.log(JSON.stringify(results, null, 2));
  
}

async function fetchFiveRecords(client, collectionName) {
    console.log(`\nExtrayendo 5 registros de: ${collectionName}`);
    const collection = client.db("sample_mflix").collection(collectionName).find({}).limit(5);
    
  const results = await collection.toArray();
  // Mostrar resultados
  console.log("Películas encontradas:");
  console.log(JSON.stringify(results, null, 2));
}

async function main() {
const uri = "mongodb+srv://kdocdany_db_user:lBlUz597KFx5jQwG@cluster0.u4w7qod.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, { 
    family: 4, 
    connectTimeoutMS: 10000 
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await listDatabases(client);
    await findAllData(client);
    await fetchFiveRecords(client, "embedded_movies");
    await fetchFiveRecords(client, "comments");

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);