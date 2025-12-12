import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Commission } from './entities/commision.entity';
import { Participant } from 'src/participant/entities/participant.entity';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [TypeOrmModule.forFeature([Transaction, Commission, Participant])],
})
export class TransactionModule {}
