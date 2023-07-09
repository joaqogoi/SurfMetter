import express, { response } from "express"
import mysql from "mysql2"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"


const __dirname = path.resolve();
const app = express();

//Midelwares
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.static("public", { extensions: ["html", "css"] }));

dotenv.config()

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/users", (req, res) => {
    res.sendFile(path.join(__dirname + "/users.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname + "/about.html"));
});


//Inicializacion
app.listen(3000, () => {
    console.log("servidor enlazado")
});