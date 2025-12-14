import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Participants')
@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un participante' })
  @ApiResponse({
    status: 201,
    description: 'Participante creado correctamente',
  })
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(createParticipantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar participantes' })
  findAll() {
    return this.participantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener participante por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantService.findOne(id);
  }

  @Get(':id/commissions')
  @ApiOperation({ summary: 'Obtener comisiones de un participante' })
  getParticipantCommissions(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantService.getParticipantCommissions(id);
  }

  @Get(':id/tree')
  @ApiOperation({ summary: 'Obtener árbol jerárquico del participante' })
  getHierarchyTree(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantService.getHierarchyTree(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar participante' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.participantService.update(id, updateParticipantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar participante' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantService.remove(id);
  }
}
