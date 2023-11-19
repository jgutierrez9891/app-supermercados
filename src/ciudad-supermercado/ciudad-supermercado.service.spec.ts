/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();
 
    supermercadosList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: faker.string.alpha({ length: { min: 11, max: 20 } }),
          longitud: faker.lorem.sentence(),
          latitud: faker.lorem.sentence(),
          paginaWeb: faker.image.url(),
        })
        supermercadosList.push(supermercado);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.string.alpha(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int({min:1000, max:1000000000}),
      supermercados: supermercadosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermercadoCiudad should add a supermarket to a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.string.alpha({ length: { min: 11, max: 20 } }),
      longitud: faker.lorem.sentence(),
      latitud: faker.lorem.sentence(),
      paginaWeb: faker.image.url(),
    });
 
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.string.alpha(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int({min:1000, max:1000000000}),
    })
 
    const result: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
   
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre)
    expect(result.supermercados[0].longitud).toBe(newSupermercado.longitud)
    expect(result.supermercados[0].latitud).toBe(newSupermercado.latitud)
    expect(result.supermercados[0].paginaWeb).toBe(newSupermercado.paginaWeb)
  });

  it('addSupermercadoCiudad should throw exception for an invalid supermarket', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.string.alpha(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int({min:1000, max:1000000000}),
    })
 
    await expect(() => service.addSupermarketToCity(newCiudad.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('addSupermercadoCiudad should throw exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository .save({
      nombre: faker.string.alpha({ length: { min: 11, max: 20 } }),
      longitud: faker.lorem.sentence(),
      latitud: faker.lorem.sentence(),
      paginaWeb: faker.image.url(),
    });
 
    await expect(() => service.addSupermarketToCity("0", newSupermercado.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findSupermarketFromCity should return a supermarket by city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id )
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
    expect(storedSupermercado.longitud).toBe(supermercado.longitud);
    expect(storedSupermercado.latitud).toBe(supermercado.latitud);
    expect(storedSupermercado.paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findSupermarketFromCity should throw an exception for a supermarket not associated to the city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.string.alpha({ length: { min: 11, max: 20 } }),
      longitud: faker.lorem.sentence(),
      latitud: faker.lorem.sentence(),
      paginaWeb: faker.image.url(),
    });
 
    await expect(()=> service.findSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city");
  });

  it('findSupermarketsFromCity should return the supermarkets by city', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteSupermarketFromCity should delete a supermarket from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
   
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);
 
    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const deletedProducto: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === supermercado.id);
 
    expect(deletedProducto).toBeUndefined();
 
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteSupermarketFromCity should throw an exception for a supermarket not associated to the city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.string.alpha({ length: { min: 11, max: 20 } }),
      longitud: faker.lorem.sentence(),
      latitud: faker.lorem.sentence(),
      paginaWeb: faker.image.url(),
    });
 
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city");
  });

});
