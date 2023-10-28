import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1698438045117 } from "./migration/1698438045117-create-users-table";
import { CreateRolesTable1698438337443 } from "./migration/1698438337443-create-roles-table";
import { CreatePortfoliosTable1698439006907 } from "./migration/1698439006907-create-portfolios-table";
// import { User } from "./models/User";
// import { Artist } from "./models/Artist";
// import { Client } from "./models/Client";
// import { Portfolio } from "./models/Portfolio";
// import { Portfolio_artist } from "./models/Portfolio_artist";
// import { Role_user } from "./models/Role_use";
// import { Role } from "./models/Role";
// import { Appointment } from "./models/Appointment";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "tattoo_studio_db",
    migrations: [
        CreateUsersTable1698438045117,
        CreateRolesTable1698438337443,
        CreatePortfoliosTable1698439006907

    ],
    // entities: [User, Artist, Client, Portfolio, Portfolio_artist, Role_user, Role, User, Appointment],
    synchronize: false,
    logging: false,
});

export {AppDataSource}