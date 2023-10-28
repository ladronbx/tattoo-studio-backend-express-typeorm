import { MigrationInterface, QueryRunner, Table } from "typeorm"

class CreatePortfolioTable1698508205982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "portfolios",
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
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "category",
                        type: "enum",
                        enum: ["piercing", "tattoo"],
                        isNullable: false
                    },
                    {
                        name: "image",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "price",
                        type: "float",
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
        await queryRunner.dropTable("portfolios")
    }

}


export { CreatePortfolioTable1698508205982 }