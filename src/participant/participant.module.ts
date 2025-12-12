import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';

import { Participant } from './entities/participant.entity';
import { Commission } from 'src/transaction/entities/commision.entity';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService],
  imports: [TypeOrmModule.forFeature([Participant, Commission])],
})
export class ParticipantModule {}
