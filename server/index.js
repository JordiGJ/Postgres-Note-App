const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

// variables
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
// this one allows to read the content of the request.body
app.use(express.json());

// ROUTES

// create a note
app.post('/minota', async (req, res) => {
  try {
    const { description } = req.body;
    res.send(description);

    const newNota = await pool.query(
      'INSERT INTO minota (description) VALUES($1) RETURNING *',
      [description]
    );
    res.json(newNota.rows[0]);
  } catch (error) {
    console.error(error.menssage);
  }
});

// get all notes
app.get('/minota', async (req, res) => {
  try {
    // get all notes in descending order
    const allMiNotas = await pool.query(
      'SELECT * FROM minota ORDER BY minota_id DESC'
    );
    res.json(allMiNotas.rows);
  } catch (error) {
    console.error(error.menssage);
  }
});

// get a note

// update a note
app.put('/minota/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateNote = await pool.query(
      'UPDATE minota SET description = $1 WHERE minota_id = $2',
      [description, id]
    );
    res.json('Note was updated');
  } catch (error) {
    console.error(error.menssage);
  }
});

// delete a note

app.delete('/minota/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const delteNote = await pool.query(
      'DELETE FROM minota WHERE minota_id = $1',
      [id]
    );
    res.json('Note was deleted succesfully');
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
