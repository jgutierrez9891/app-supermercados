/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermercadoService: SupermercadoService) {}

    @Get()
    async findAll() {
        return await this.supermercadoService.findAll();
    }

    @Get(':supermercadoId')
    async findOne(@Param('supermercadoId') supermercadoId: string) {
        return await this.supermercadoService.findOne(supermercadoId);
    }

    @Post()
    async create(@Body() SupermercadoDto: SupermercadoDto) {
        const ciudad: SupermercadoEntity = plainToInstance(SupermercadoEntity, SupermercadoDto);
        return await this.supermercadoService.create(ciudad);
    }

    @Put(':supermercadoId')
    async update(@Param('supermercadoId') supermercadoId: string, @Body() SupermercadoDto: SupermercadoDto) {
        const ciudad: SupermercadoEntity = plainToInstance(SupermercadoEntity, SupermercadoDto);
        return await this.supermercadoService.update(supermercadoId, ciudad);
    }

    @Delete(':supermercadoId')
    @HttpCode(204)
    async delete(@Param('supermercadoId') supermercadoId: string) {
        return await this.supermercadoService.delete(supermercadoId);
    }
}
