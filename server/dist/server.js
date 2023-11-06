"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const path = require("path");
const clientPath = path.join(__dirname, "../../client");
app.use(express.static(clientPath));
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect((err, resul) => {
    if (err) {
        throw err;
    }
    console.log(`Connected successfully to the database! ${resul}`);
});
app.get("/contacts", (_req, res) => {
    connection.query("SELECT id, name, email, phone FROM contacts", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error fetching contacts" });
        }
        else {
            res.json(result);
        }
    });
});
app.delete("/delete-contact/:id", (req, res) => {
    const contactId = req.params.id;
    const sqlQuery = "DELETE FROM contacts WHERE id = ?";
    connection.query(sqlQuery, [contactId], (err, _result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error deleting contact 👎");
        }
        else {
            console.log("Contact deleted successfully! 👍");
            res.send("Contact deleted successfully! 👍");
        }
    });
});
app.post("/add-contact", (req, res) => {
    const { ContactName, ContactEmail, ContactPhone } = req.body;
    const sqlQuery = "INSERT INTO contacts (name, email, phone, date_created) VALUES (?, ?, ?, NOW())";
    connection.query(sqlQuery, [ContactName, ContactEmail, ContactPhone], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error adding new contact!");
        }
        else {
            console.log("New contact added successfully! ✔", result);
            res.send("New contact added successfully! ✔");
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}...`);
});
//# sourceMappingURL=server.js.map