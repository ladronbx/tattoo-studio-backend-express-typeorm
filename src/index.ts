import express from "express";
//Las rutas que no se te olvideeeen ^^
import { AppDataSource } from "./db";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        // Encendido del servidor
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    })
    .catch(error => {
        console.log(error);
    });