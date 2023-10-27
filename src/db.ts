import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1698295901193 } from "./migration/1698295901193-create-users-table";
import { CreateRolesTable1698296931960 } from "./migration/1698296931960-create-roles-table";
import { CreatePortfoliosTable1698297252842 } from "./migration/1698297252842-create-portfolios-table";
import { CreateClientsTable1698297600908 } from "./migration/1698297600908-create-clients-table";
import { CreateArtistsTable1698297698007 } from "./migration/1698297698007-create-artists-table";
import { CreatePortfolioArtistTable1698298091237 } from "./migration/1698298091237-create-portfolio_artist-table";
import { CreateAppointmentsTable1698298269709 } from "./migration/1698298269709-create-appointments-table";
import { CreateRoleUserTable1698337740215 } from "./migration/1698337740215-create-role_user-table";
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
        CreateUsersTable1698295901193,
        CreateRolesTable1698296931960,
        CreatePortfoliosTable1698297252842,
        CreateClientsTable1698297600908,
        CreateArtistsTable1698297698007,
        CreatePortfolioArtistTable1698298091237,
        CreateAppointmentsTable1698298269709,
        CreateRoleUserTable1698337740215
        

    ],
    entities: [User, Artist, Client, Portfolio, Portfolio_artist, Role_user, Role, User, Appointment],
    synchronize: false,
    logging: false,
});

export {AppDataSource}