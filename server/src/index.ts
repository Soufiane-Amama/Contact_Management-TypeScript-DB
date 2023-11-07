
const express = require("express");
import express, { Request, Response } from "express";
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const path = require("path");
const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));


app.use(cors());

// app.use(cors({
//   origin: 'https://trading-max-app.vercel.app',
//   credentials: true
// }));

// =========================================

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.connect((err, resul)=>{
  if(err){
    throw err;
  }
    console.log(`Connected successfully to the database! ${resul}`);
});

// =========================================

app.get("/contacts", (_req: Request, res: Response): Response => {
  connection.query("SELECT id, name, email, phone FROM contacts", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error fetching contacts" });
    } else {
    res.json(result);
    }
  });
});


app.delete("/delete-contact/:id", (req: Request, res: Response): Response =>{
  const contactId = req.params.id;
  const sqlQuery = "DELETE FROM contacts WHERE id = ?";
  connection.query(sqlQuery, [contactId], (err, _result)=> {
    if(err){
      console.log(err);
      res.status(500).send("Error deleting contact 👎");
    } else {
      console.log("Contact deleted successfully! 👍");
      res.send("Contact deleted successfully! 👍");
    }
  });
});


app.post("/add-contact", (req: Request, res: Response): Response => {
  const { ContactName, ContactEmail, ContactPhone } = req.body;
  const sqlQuery = "INSERT INTO contacts (name, email, phone, date_created) VALUES (?, ?, ?, NOW())";
  connection.query(sqlQuery, [ContactName, ContactEmail, ContactPhone], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding new contact!");
    } else {
      console.log("New contact added successfully! ✔", result);
      res.send("New contact added successfully! ✔");
    }
  });
});


app.get('/hi', async (req, res) => {
  res.send("Hello Soufiane!");
});



app.listen(PORT, ()=>{
  console.log(`Server has started on PORT ${PORT}...`);
});
