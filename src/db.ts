import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Role } from "./models/Role";
import { Portfolio } from "./models/Portfolio";
import { Appointment } from "./models/Appointment";
import { CreateRolesTable1698507821394 } from "./migration/1698507821394-create-roles-table";
import { CreateUsersTable1698508040558 } from "./migration/1698508040558-create-users-table";
import { CreatePortfolioTable1698508205982 } from "./migration/1698508205982-create-portfolio-table";
import { CreateAppointmentsTable1698508279550 } from "./migration/1698508279550-create-appointments-table";
import { CreateAppointmentPortfolioTable1698508382236 } from "./migration/1698508382236-create-appointment_portfolio-table";


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
        CreatePortfolioTable1698508205982,
        CreateAppointmentsTable1698508279550,
        CreateAppointmentPortfolioTable1698508382236
    ],
    entities: [User, Role, Portfolio, Appointment],
    synchronize: false,
    logging: false,
});

export {AppDataSource}