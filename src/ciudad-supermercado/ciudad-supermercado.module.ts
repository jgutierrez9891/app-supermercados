import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  providers: [CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController],
})
export class CiudadSupermercadoModule {}
