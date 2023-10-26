import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Artist } from "./Artist"

@Entity("portfolio")
export class Portfolio extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    category!: string

    @Column()
    image!: string

    @Column()
    price!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date
    
    //hacia donde apunto
    @ManyToMany(() => Artist)
    @JoinTable({
        //a través de quién
        name: "portfolio_artist",
        //qué aporto
        joinColumn: {
            name: "portfolio_id",
            referencedColumnName: "id",
        },
        //qué me aporta
        inverseJoinColumn: {
            name: "artist_id",
            referencedColumnName: "id",
        },
    })
    //donde estoy a donde voy
   portfolioArtists!: Artist[];


}


