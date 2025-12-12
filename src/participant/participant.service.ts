import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from 'src/transaction/entities/commision.entity';

export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
}

@Injectable()
export class ParticipantService {
  private readonly logger = new Logger(ParticipantService.name);
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,

    @InjectRepository(Commission)
    private commissionRepo: Repository<Commission>,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    try {
      const participant =
        this.participantRepository.create(createParticipantDto);
      await this.participantRepository.save(participant);

      return participant;
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.participantRepository.find({});
  }

  async findOne(id: string) {
    const participant = await this.participantRepository.findOneBy({ id });
    if (!participant) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
    return participant;
  }

  async getParticipantCommissions(participantId: string) {
    const participant = await this.participantRepository.findOne({
      where: { id: participantId },
    });

    console.log(participant);

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // Obtener comisiones
    return await this.commissionRepo.find({
      where: { participantId },
      relations: ['transaction'],
      order: { createdAt: 'DESC' },
    });
  }

  async getHierarchyTree(id: string) {
    const participant = await this.participantRepository.findOne({
      where: { id },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    return this.buildTree(participant, 0); // nivel inicial = 0
  }

  private async buildTree(node: Participant, level: number) {
    const MAX_LEVEL = 3; // límite de profundidad

    const result: TreeNode = {
      id: node.id,
      name: node.name,
      children: [],
    };

    // Si ya llegó al nivel máximo → no buscar más hijos
    if (level >= MAX_LEVEL) {
      return result;
    }

    // Buscar hijos directos
    const children = await this.participantRepository.find({
      where: { parentId: node.id },
    });

    result.children = await Promise.all(
      children.map((child) => this.buildTree(child, level + 1)),
    );

    return result;
  }

  update(id: string, updateParticipantDto: UpdateParticipantDto) {
    console.log(updateParticipantDto);
    return `This action updates a #${id} participant`;
  }

  async remove(id: string) {
    const participant = await this.findOne(id);
    await this.participantRepository.remove(participant);
  }

  private handleDBExceptions(error: any) {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
