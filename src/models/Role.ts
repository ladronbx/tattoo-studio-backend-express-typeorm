import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,OneToMany } from "typeorm"
import { User } from "./User"

@Entity("roles")
class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    role!: string

    @Column()
    privilege!: string

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @OneToMany(() => User, (user) => user.userRoles)
    users!: User[];

}

export { Role }
