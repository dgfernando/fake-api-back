const express = require('express');
const { createClient } = require("@libsql/client"); 
const bodyParser = require('body-parser'); 

const client = createClient({
  url: "libsql://bdtest-dgfernando.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTY2MDIyMzYsImlkIjoiODg5ZmQ3MWItNGU2OC00M2I1LTg0M2YtZDYwYjgwYTY4ZjQ0In0.YPLirqY9w-ANvFBzaM40M4xKGY-yoDlIwmREJwahr6DMU_soYmE5a7cpOlwkL62FJG8skrwaC9MLkjzT6mr8BQ",
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