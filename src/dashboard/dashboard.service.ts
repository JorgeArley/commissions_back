import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Participant } from 'src/participant/entities/participant.entity';
import { Commission } from 'src/transaction/entities/commision.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,

    @InjectRepository(Commission)
    private readonly commissionReposytory: Repository<Commission>,
  ) {}

  async getStats() {
    const totalTransactions = await this.transactionRepository.count();

    const totalTransactionAmount = await this.transactionRepository
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'total')
      .getRawOne<{ total: string }>();

    const totalParticipants = await this.participantRepository.count();

    const commissionsByLevel = await this.commissionReposytory
      .createQueryBuilder('c')
      .select('c.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(c.amount))', 'totalAmount')
      .groupBy('c.level')
      .orderBy('c.level', 'ASC')
      .getRawMany();

    return {
      transactions: {
        total: totalTransactions,
        totalAmount: Number(totalTransactionAmount?.total) || 0,
      },
      participants: {
        total: totalParticipants,
      },
      commissions: commissionsByLevel.map((row) => ({
        level: Number(row.level),
        count: Number(row.count),
        totalAmount: Number(row.totalAmount),
      })),
    };
  }
}
