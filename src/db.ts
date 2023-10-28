import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1698438045117 } from "./migration/1698438045117-create-users-table";
import { CreateRolesTable1698438337443 } from "./migration/1698438337443-create-roles-table";
import { CreatePortfoliosTable1698439006907 } from "./migration/1698439006907-create-portfolios-table";
import { CreateRoleUserTable1698451558679 } from "./migration/1698451558679-create-role_user-table";
import { CreateAppointmentsTable1698451686654 } from "./migration/1698451686654-create-appointments-table";
import { CreateAppointmentsPortfolioTable1698452039638 } from "./migration/1698452039638-create-appointments_portfolio-table";
import { User } from "./models/User";
import { Role } from "./models/Role";

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
        CreatePortfoliosTable1698439006907,
        CreateRoleUserTable1698451558679,
        CreateAppointmentsTable1698451686654,
        CreateAppointmentsPortfolioTable1698452039638

    ],
    entities: [User, Role],
    synchronize: false,
    logging: false,
});

export {AppDataSource}