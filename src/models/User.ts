import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, OneToMany } from "typeorm"
import { Role } from "./Role"
import { Client } from "./Client"
import { Artist } from "./Artist"

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

    @OneToMany(() => Client, (client) => client.user)
    clients!: Client[];

    @OneToMany(() => Artist, (artist) => artist.user)
    artists!: Artist[];


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


export { User }