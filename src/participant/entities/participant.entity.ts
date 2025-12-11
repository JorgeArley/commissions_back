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

  @Column({
    type: 'enum',
    enum: [1, 2, 3],
  })
  level: 1 | 2 | 3;

  // Relación self-reference → parentId
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => Participant, (p) => p.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Participant;

  @OneToMany(() => Participant, (p) => p.parent)
  children: Participant[];

  // Relación con transacciones
  // @OneToMany(() => Transaction, (t) => t.participant)
  // transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;
}
