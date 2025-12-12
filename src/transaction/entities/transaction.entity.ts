import { Participant } from 'src/participant/entities/participant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Commission } from './commision.entity';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Clave foránea hacia participant
  @Column({ type: 'uuid' })
  participantId: string;

  @ManyToOne(() => Participant, (p) => p.transactions)
  @JoinColumn({ name: 'participantId' })
  participant: Participant;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Commission, (c) => c.transaction)
  commissions: Commission[];
}
