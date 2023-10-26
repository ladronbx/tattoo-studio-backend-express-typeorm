import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm"
import { Artist } from "./Artist"
import { User } from "./User"


@Entity("clients")
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    user_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @ManyToOne(() => User, (user) => user.clients)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToMany(() => Artist)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "client_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "artist_id",
            referencedColumnName: "id",
        },
    })

   clientArtists!: Artist[];
}
