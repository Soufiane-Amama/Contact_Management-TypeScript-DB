"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var mysql = require("mysql2");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var cors = require('cors');
dotenv.config();
var PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var path = require("path");
var clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));
app.use(cors()); 

// app.use(cors({ 
//   origin: 'https://trading-max-app.vercel.app',
//   credentials: true
// }));
// =========================================
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
connection.connect(function (err, resul) {
    if (err) {
        throw err;
    }
    console.log("Connected successfully to the database! ".concat(resul));
});
// =========================================
app.get("/contacts", function (_req, res) {
    connection.query("SELECT id, name, email, phone FROM contacts", function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error fetching contacts" });
        }
        else {
            res.json(result);
        }
    });
});
app.delete("/delete-contact/:id", function (req, res) {
    var contactId = req.params.id;
    var sqlQuery = "DELETE FROM contacts WHERE id = ?";
    connection.query(sqlQuery, [contactId], function (err, _result) {
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
app.post("/add-contact", function (req, res) {
    var _a = req.body, ContactName = _a.ContactName, ContactEmail = _a.ContactEmail, ContactPhone = _a.ContactPhone;
    var sqlQuery = "INSERT INTO contacts (name, email, phone, date_created) VALUES (?, ?, ?, NOW())";
    connection.query(sqlQuery, [ContactName, ContactEmail, ContactPhone], function (err, result) {
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
app.listen(PORT, function () {
    console.log("Server has started on PORT ".concat(PORT, "..."));
});
