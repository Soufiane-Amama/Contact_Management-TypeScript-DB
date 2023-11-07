"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
app.get('/hi', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send("Hello Soufiane!");
        return [2 /*return*/];
    });
}); });
app.listen(PORT, function () {
    console.log("Server has started on PORT ".concat(PORT, "..."));
});
