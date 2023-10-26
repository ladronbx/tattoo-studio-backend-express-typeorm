import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("appointments")
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "date" })
    date!: string;

    @Column({ type: "time" })
    time!: string;

    @Column()
    status!: boolean

    @Column()
    artist_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @ManyToMany(() => Role)
    @JoinTable({
        name: "role_user",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id",
        },
    })

   userRoles!: Role[];

}
