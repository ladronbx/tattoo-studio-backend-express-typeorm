import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1698295901193 } from "./migration/1698295901193-create-users-table";
import { CreateRolesTable1698296931960 } from "./migration/1698296931960-create-roles-table";
import { CreatePortfoliosTable1698297252842 } from "./migration/1698297252842-create-portfolios-table";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "tattoo_studio_db",
    migrations: [
        CreateUsersTable1698295901193,
        CreateRolesTable1698296931960,
        CreatePortfoliosTable1698297252842

    ],
    entities: [],
    synchronize: false,
    logging: false,
});

export {AppDataSource}