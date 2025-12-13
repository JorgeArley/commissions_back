import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Participant } from 'src/participant/entities/participant.entity';
import { Commission } from 'src/transaction/entities/commision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Participant, Commission])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
