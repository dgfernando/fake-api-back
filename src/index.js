const express = require('express');
const { createClient } = require("@libsql/client"); 
const bodyParser = require('body-parser'); 

const client = createClient({
  url: "libsql://bdtest-dgfernando.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTY1ODQwNjQsImlkIjoiNDk3ODQ2ODMtY2EyMS00NzFiLTgwNWMtOTdjNjc2NDc4ZTNiIn0.Q7YY2xoaO1ShxDGcnrjloaziTX_sc8jgqXCCatbQEb6vLvKIz2IlEV9HXpsP2-GO7ugeJhfJUkuJ13HA0eO1Aw",
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

app.get('/characters', async (req, res) => {
  const characters = await client.execute("SELECT * FROM characters"); 
    res.json({results: characters.rows, info: "ok"});
}); 

app.post('/characters', async (req, res) => {
  const { name, status, image } = req.body;
  
  const characters = await client.execute(`
    INSERT INTO characters (name, status, image) VALUES ("${name}", "${status}", "${image}");`
  ); 
  res.json({ message: "Character created"});
}); 

// app.put(''){

// }

app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params;
  await client.execute(`DELETE FROM characters WHERE id = ${id}`); 
  res.json({message: "Character deleted"});
}); 

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
}); 