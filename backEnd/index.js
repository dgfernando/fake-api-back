const express = require('express');
const { createClient } = require("@libsql/client"); 
const bodyParser = require('body-parser'); 
const cors = require('cors')

const client = createClient({
  url: "libsql://db-dgfernando.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTY2MDkyNjIsImlkIjoiNjRkMjg2ZGYtODhmNi00YTllLWIzZTYtYjA3MDgwN2E0OTcxIn0.HLKxGbdQTbVGze6qmKHxnvvjHor9bI2Ww1Fy4wgvjuVXP4DJwKJoWIZ-zi54lhhynJofVRdQ6qh3GTkbATDbBA",
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/products", async (req, res) => {
  const products = await client.execute("SELECT * FROM products");
  res.json({ results: products.rows, info: "ses" });
});

app.post("/products", async (req, res) => {
  const { title, price, description, categoryId, images } = req.body;

  const products = await client.execute(`
    INSERT INTO products (title, price, description, categoryId, images) VALUES ("${title}", "${price}", "${description}", "${categoryId}", "${images}");`);
  res.json({ message: "Product created" });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, description, categoryId, images } = req.body;

  await client.execute(`
      UPDATE products 
      SET title = "${title}", price = "${price}", description = "${description}", categoryId = "${categoryId}", images = "${images}"
      WHERE id = ${id}
      `);

  res.json({ message: "Producto actualizado" });
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await client.execute(`DELETE FROM products WHERE id = ${id}`);
  res.json({ message: "Product deleted" });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});