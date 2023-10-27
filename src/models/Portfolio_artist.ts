import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("portfolio")
export class Portfolio_artist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    portfolio_id!: number

    @Column()
    worker_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

}
