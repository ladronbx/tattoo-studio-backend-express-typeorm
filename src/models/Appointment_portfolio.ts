import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("role_user")
class Appointment_porfolio extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    appointment_id!: number

    @Column()
    portfolio_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date
}

export { Appointment_porfolio }