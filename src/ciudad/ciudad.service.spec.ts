/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for(let i = 0; i < 5; i++){
        const ciudad: CiudadEntity = await repository.save({
        nombre: faker.string.alpha(),
        pais: faker.location.country(),
        numeroHabitantes: faker.number.int({min:1000, max:1000000000}),
        })
        ciudadesList.push(ciudad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
    expect(ciudad.pais).toEqual(storedCiudad.pais)
    expect(ciudad.numeroHabitantes).toEqual(storedCiudad.numeroHabitantes)
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The city with the given id was not found")
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.string.alpha(),
      pais: "Argentina",
      numeroHabitantes: faker.number.int({min:1000, max:1000000000}),
      supermercados: []
    }

    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity | null = await repository.findOne({ where: { id: newCiudad.id } })
    expect(storedCiudad).not.toBeNull();
    if(storedCiudad != null){
      expect(ciudad.nombre).toEqual(storedCiudad.nombre)
      expect(ciudad.pais).toEqual(storedCiudad.pais)
      expect(ciudad.numeroHabitantes).toEqual(storedCiudad.numeroHabitantes)
    }
  });

  it('update should modify a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "New name";
    ciudad.pais = "Ecuador";
    ciudad.numeroHabitantes = faker.number.int({min:1000, max:1000000000});
      const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
      const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
    expect(storedCiudad.pais).toEqual(ciudad.pais)
    expect(storedCiudad.numeroHabitantes).toEqual(ciudad.numeroHabitantes)    
  });

  it('update should throw an exception for an invalid city', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, nombre: "New name", pais: "New description"
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "The city with the given id was not found")
  });

  it('delete should remove a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
     const deletedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The city with the given id was not found")
  });

});
