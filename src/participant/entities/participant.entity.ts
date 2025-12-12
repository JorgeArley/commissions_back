import { Commission } from 'src/transaction/entities/commision.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  // Relación self-reference → parentId
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => Participant, (p) => p.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Participant;

  @OneToMany(() => Participant, (p) => p.parent)
  children: Participant[];

  // Relación con transacciones
  @OneToMany(() => Transaction, (t) => t.participant)
  transactions: Transaction[];

  @OneToMany(() => Commission, (c) => c.participant)
  commissions: Commission[];

  @CreateDateColumn()
  createdAt: Date;
}
