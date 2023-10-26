import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn} from "typeorm"
import { Client } from "./Client"
import { Portfolio } from "./Portfolio"
import { User } from "./User"
@Entity("artists")
export class Artist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    hours_worked!: number

    @Column()
    user_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @ManyToOne(() => User, (user) => user.clients)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToMany(() => Client)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "artist_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "client_id",
            referencedColumnName: "id",
        },
    })

   artistClients!: Client[];

   @ManyToMany(() => Portfolio)
   @JoinTable({
       name: "portfolio_artist",
       joinColumn: {
           name: "artist_id",
           referencedColumnName: "id",
       },
       inverseJoinColumn: {
           name: "portfolio_id",
           referencedColumnName: "id",
       },
   })

  artistPortfolios!: Portfolio[];

}
