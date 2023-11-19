/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.string.alpha({ length: { min: 11, max: 20 } }),
        longitud: faker.lorem.sentence(),
        latitud: faker.lorem.sentence(),
        paginaWeb: faker.image.url(),
        })
        supermercadosList.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all superkarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud)
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud)
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('create should return a new supermarket', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.string.alpha({ length: { min: 11, max: 20 } }),
      longitud: faker.lorem.sentence(),
      latitud: faker.lorem.sentence(),
      paginaWeb: faker.image.url(),
      ciudades: []
    }

    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity | null = await repository.findOne({ where: { id: newSupermercado.id } })
    expect(storedSupermercado).not.toBeNull();
    if(storedSupermercado != null){
      expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre)
      expect(storedSupermercado.longitud).toEqual(newSupermercado.longitud)
      expect(storedSupermercado.latitud).toEqual(newSupermercado.latitud)
      expect(storedSupermercado.paginaWeb).toEqual(newSupermercado.paginaWeb)
    }
  });

  it('update should modify a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = faker.string.alpha({ length: { min: 11, max: 20 } });
    supermercado.longitud = faker.lorem.sentence();
    supermercado.latitud = faker.lorem.sentence();
    supermercado.paginaWeb = faker.image.url();
      const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();
      const storedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
      expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
      expect(storedSupermercado.longitud).toEqual(supermercado.longitud)
      expect(storedSupermercado.latitud).toEqual(supermercado.latitud)
      expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb) 
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: "New name", longitud: "New description", latitud: "New description"
    }
    await expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('delete should remove a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
     const deletedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });













});
