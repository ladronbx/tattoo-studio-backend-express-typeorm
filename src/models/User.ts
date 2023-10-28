import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from "typeorm"
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

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "artist_id",
            referencedColumnName: "id"
        }
    })
    clientartists!: User[]

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "artist_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        }
    })
    artistClients!: User[]

    @ManyToOne(() => Role, role => role.user)
    @JoinColumn ({name: "role_id"})
    roles!: Role
}

export { User }

