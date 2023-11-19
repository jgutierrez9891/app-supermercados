/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService) {}

    @Post('cities/:ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.ciudadSupermercadoService.addSupermarketToCity(ciudadId, supermercadoId);
    }

    @Get('cities/:ciudadId/supermarkets/:supermercadoId')
    async findSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.ciudadSupermercadoService.findSupermarketFromCity(ciudadId, supermercadoId);
    }

    @Get('cities/:ciudadId/supermarkets')
    async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string){
        return await this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
    }

    @Put('cities/:ciudadId/supermarkets')
    async updateSupermarketsFromCity(@Body() supermercadosDto: SupermercadoDto[], @Param('ciudadId') ciudadId: string){
        const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto)
        return await this.ciudadSupermercadoService.updateSupermarketsFromCity(ciudadId, supermercados);
    }

    @Delete('cities/:ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.ciudadSupermercadoService.deleteSupermarketFromCity(ciudadId, supermercadoId);
    }
}


