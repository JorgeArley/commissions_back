import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Participant } from 'src/participant/entities/participant.entity';

@Entity('commission')
export class Commission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  transactionId: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @Column({ type: 'uuid' })
  participantId: string;

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participantId' })
  participant: Participant;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  percentage: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
