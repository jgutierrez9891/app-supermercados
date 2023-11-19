/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({ relations: ["supermercados"] });
}

async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"] } );
    if (!ciudad)
        throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);

    return ciudad;
}

async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (ciudad.pais != "Argentina" && ciudad.pais != "Ecuador" && ciudad.pais != "Paraguay")
        throw new BusinessLogicException("The city doesn't belong to the required countries", BusinessError.PRECONDITION_FAILED);

    return await this.ciudadRepository.save(ciudad);
}

async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const persistedCity: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
    if (!persistedCity)
        throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
    else if (ciudad.pais != "Argentina" && ciudad.pais != "Ecuador" && ciudad.pais != "Paraguay")
        throw new BusinessLogicException("The city doesn't belong to the required countries", BusinessError.PRECONDITION_FAILED);

    return await this.ciudadRepository.save(ciudad);
}

async delete(id: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
    if (!ciudad)
        throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
    
    await this.ciudadRepository.remove(ciudad);
}
}
