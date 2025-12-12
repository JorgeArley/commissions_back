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

@Injectable()
export class ParticipantService {
  private readonly logger = new Logger(ParticipantService.name);
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
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
