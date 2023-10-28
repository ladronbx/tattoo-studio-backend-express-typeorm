import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm"
import { Role } from "./Role"

@Entity("users")
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    full_name!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @Column()
    phone_number!: number

    @Column()
    is_active!: boolean

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn ({name: "role_id"})
    role!: Role;
    userRoles!: Role[]

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "worker_id",
            referencedColumnName: "id"
        }
    })
    clientWorkers!: User[]

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "worker_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        }
    })
    workerClients!: User[]
}

export { User }

