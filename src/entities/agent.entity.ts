import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { Registration } from './registration.entity';

export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('agents')
@Index(['userId'], { unique: true })
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.agents, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.FIELD_AGENT,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255 })
  state: string;

  @Column({ type: 'varchar', length: 255 })
  lga: string;

  @Column({ type: 'varchar', length: 255 })
  ward: string;

  @Column({ type: 'int', default: 0 })
  totalRegistrations: number;

  @Column({ type: 'int', default: 0 })
  verifiedRegistrations: number;

  @Column({ type: 'int', default: 0 })
  pendingRegistrations: number;

  @Column({ type: 'int', default: 0 })
  rejectedRegistrations: number;

  @Column({
    type: 'enum',
    enum: AgentStatus,
    default: AgentStatus.ACTIVE,
  })
  status: AgentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt: Date;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Registration, (registration) => registration.agent)
  registrations: Registration[];
}
