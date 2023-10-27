import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Artist } from "./models/Artist";
import { Client } from "./models/Client";
import { Portfolio } from "./models/Portfolio";
import { Portfolio_artist } from "./models/Portfolio_artist";
import { Role_user } from "./models/Role_use";
import { Role } from "./models/Role";
import { Appointment } from "./models/Appointment";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "tattoo_studio_db",
    migrations: [

    ],
    entities: [User, Artist, Client, Portfolio, Portfolio_artist, Role_user, Role, User, Appointment],
    synchronize: false,
    logging: false,
});

export {AppDataSource}