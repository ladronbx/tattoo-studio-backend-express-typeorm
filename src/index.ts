import express, { Router } from "express";
import { AppDataSource } from "./db";
import { userRouter } from "./routes/usersRoutes";
import { appointmentsRouter } from "./routes/appointmentsRoutes";
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
<<<<<<< HEAD
// app.use('/users', routerUsers)
// app.use('/appointments', )
=======
app.use('/user', userRouter)
app.use('/user/appointments', appointmentsRouter)
>>>>>>> dev

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