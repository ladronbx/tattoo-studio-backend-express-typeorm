import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

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

}

export { Role }
