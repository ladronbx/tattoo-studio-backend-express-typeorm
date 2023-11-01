import "reflect-metadata";
import 'dotenv/config'
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Role } from "./models/Role";
import { Portfolio } from "./models/Portfolio";
import { Appointment } from "./models/Appointment";
import { CreateRolesTable1698507821394 } from "./migration/1698507821394-create-roles-table";
import { CreateUsersTable1698508040558 } from "./migration/1698508040558-create-users-table";
import { CreateAppointmentsTable1698570797662 } from "./migration/1698570797662-create-appointments-table";
import { CreatePortfoliosTable1698570992940 } from "./migration/1698570992940-create-portfolios-table";
import { CreateAppointmentPortfolioTable1698571096473 } from "./migration/1698571096473-create-appointment_portfolio-table";

// const database = "mysql" | "mariadb";

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    migrations: [
        CreateRolesTable1698507821394,
        CreateUsersTable1698508040558,
        CreateAppointmentsTable1698570797662,
        CreatePortfoliosTable1698570992940,
        CreateAppointmentPortfolioTable1698571096473
    ],
    entities: [User, Role, Portfolio, Appointment],
    synchronize: false,
    logging: false,
});

export {AppDataSource}