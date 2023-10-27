import express from "express";
import { AppDataSource } from "./db";
import { routerUsers } from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/users', routerUsers)

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    })
    .catch(error => {
        console.log(error);
    });