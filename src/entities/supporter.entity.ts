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
import { Registration } from './registration.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('supporters')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
@Index(['voterCardNumber'])
@Index(['state', 'lga', 'ward'])
export class Supporter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 50 })
  gender: string;

  @Column({ type: 'varchar', length: 255 })
  occupation: string;

  @Column({ type: 'varchar', length: 255 })
  state: string;

  @Column({ type: 'varchar', length: 255 })
  lga: string;

  @Column({ type: 'varchar', length: 255 })
  ward: string;

  @Column({ type: 'varchar', length: 255 })
  pollingUnit: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  voterCardNumber: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ type: 'uuid' })
  registeredByUserId: string;

  @ManyToOne(() => User, (user) => user.registeredSupporters, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'registeredByUserId' })
  registeredByUser: User;

  @Column({ type: 'text', nullable: true })
  verificationNotes: string;

  @Column({ type: 'uuid', nullable: true })
  verifiedByUserId: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'boolean', default: false })
  documentUploaded: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentUrl: string | null;

  @CreateDateColumn()
  registeredAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Registration, (registration) => registration.supporter)
  registrations: Registration[];
}
