import express from "express";
import 'dotenv/config'
import { AppDataSource } from "./db";
import { routerUsers } from "./routes/usersRoutes";
import { routerAppointments } from "./routes/appointmentsRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/users', routerUsers)
app.use('/appointments', routerAppointments)

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