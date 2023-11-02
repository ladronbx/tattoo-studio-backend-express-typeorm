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
import { CreatePortfolioTable1698945640768 } from "./migration/1698945640768-create-portfolio-table";
import { Appointment_portfolio } from "./models/Appointment_portfolio";
import { CreateAppointmentPortfolioTable1698945645357 } from "./migration/1698945645357-create-appointment_portfolio-table";

// const database = "mysql" | "mariadb";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "tattoo_studio_db", 
    migrations: [
        CreateRolesTable1698507821394,
        CreateUsersTable1698508040558,
        CreateAppointmentsTable1698570797662,
        CreatePortfolioTable1698945640768,
        CreateAppointmentPortfolioTable1698945645357
    ],
    entities: [User, Role, Portfolio, Appointment, Appointment_portfolio],
    synchronize: false,
    logging: false,
});

export {AppDataSource}