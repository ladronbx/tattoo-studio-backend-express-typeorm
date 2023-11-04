import { MigrationInterface, QueryRunner, Table } from "typeorm"

<<<<<<<< HEAD:src/migration/1698570992940-create-portfolios-table.ts
class CreatePortfoliosTable1698570992940 implements MigrationInterface {
========
class CreatePortfolioTable1698945640768 implements MigrationInterface {
>>>>>>>> dev:src/migration/1698945640768-create-portfolio-table.ts

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "portfolio",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ["tattoo", "piercing"],
                        isNullable: false
                    },
                    {
                        name: "image",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "price",
                        type: "float",
                        length: "15",
                        isNullable: false
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
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("portfolio")
    }

}

<<<<<<<< HEAD:src/migration/1698570992940-create-portfolios-table.ts

export { CreatePortfoliosTable1698570992940 }
========
export { CreatePortfolioTable1698945640768 }
>>>>>>>> dev:src/migration/1698945640768-create-portfolio-table.ts
