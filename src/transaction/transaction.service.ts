import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { Participant } from 'src/participant/entities/participant.entity';
import { Commission } from './entities/commision.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,

    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const transaction =
        this.transactionRepository.create(createTransactionDto);
      await this.transactionRepository.save(transaction);

      const participant = await this.participantRepo.findOne({
        where: { id: createTransactionDto.participantId },
        relations: ['parent', 'parent.parent', 'parent.parent.parent'], // para niveles 1,2,3
      });

      if (!participant) {
        throw new NotFoundException('Participant not found');
      }

      console.log(participant);

      // 3. Obtener su cadena de afiliados
      const level1 = participant.parent;
      const level2 = participant.parent?.parent;
      const level3 = participant.parent?.parent?.parent;

      const percentages = {
        1: 0.1,
        2: 0.05,
        3: 0.025,
      };

      const uplines = [
        { data: level1, level: 1 },
        { data: level2, level: 2 },
        { data: level3, level: 3 },
      ];

      const commissionsToSave: Commission[] = [];

      // 4. Crear comisiones automáticamente
      for (const up of uplines) {
        if (!up.data) continue;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const percentage = percentages[up.level];
        const commissionAmount =
          Number(createTransactionDto.amount) * percentage;

        const commission = this.commissionRepo.create({
          transactionId: transaction.id,
          participantId: up.data.id,
          level: up.level,
          percentage: percentage * 100,
          amount: commissionAmount,
        });

        commissionsToSave.push(commission);
      }

      // 5. Guardar todas las comisiones
      await this.commissionRepo.save(commissionsToSave);

      return {
        transaction,
        commissionsCreated: commissionsToSave.length,
      };
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.transactionRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    console.log(updateTransactionDto);
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  private handleDBExceptions(error: any) {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.code == '23503') {
      throw new NotFoundException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
