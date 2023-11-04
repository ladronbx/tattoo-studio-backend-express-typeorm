import { MigrationInterface, QueryRunner, Table } from "typeorm"

<<<<<<<< HEAD:src/migration/1698571096473-create-appointment_portfolio-table.ts
class CreateAppointmentPortfolioTable1698571096473 implements MigrationInterface {

========
class CreateAppointmentPortfolioTable1698945645357 implements MigrationInterface {
>>>>>>>> dev:src/migration/1698945645357-create-appointment_portfolio-table.ts
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "appointment_portfolio",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "appointment_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "portfolio_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["appointment_id"],
                        referencedTableName: "appointments",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["portfolio_id"],
                        referencedTableName: "portfolio",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("appointment_portfolio")
    }
}

<<<<<<<< HEAD:src/migration/1698571096473-create-appointment_portfolio-table.ts
export { CreateAppointmentPortfolioTable1698571096473 }
========
export { CreateAppointmentPortfolioTable1698945645357 }
>>>>>>>> dev:src/migration/1698945645357-create-appointment_portfolio-table.ts
