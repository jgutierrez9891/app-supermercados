/* eslint-disable prettier/prettier */
import { SupermercadoEntity } from "src/supermercado/supermercado.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CiudadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    pais: string;
    
    @Column()
    numeroHabitantes: number;

    @ManyToMany(() => SupermercadoEntity, supermercado => supermercado.ciudades)
    supermercados: SupermercadoEntity[];
}
