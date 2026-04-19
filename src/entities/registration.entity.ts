import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Agent } from './agent.entity';
import { Supporter } from './supporter.entity';

export enum RegistrationStatus {
  INITIATED = 'initiated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('registrations')
@Index(['agentId'])
@Index(['supporterId'])
@Index(['status'])
@Index(['createdAt'])
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  agentId: string;

  @ManyToOne(() => Agent, (agent) => agent.registrations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column({ type: 'uuid' })
  supporterId: string;

  @ManyToOne(() => Supporter, (supporter) => supporter.registrations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'supporterId' })
  supporter: Supporter;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.INITIATED,
  })
  status: RegistrationStatus;

  @Column({ type: 'int', default: 0 })
  completionPercentage: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true })
  verifiedByUserId: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
