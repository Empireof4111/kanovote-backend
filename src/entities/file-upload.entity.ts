import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Supporter } from './supporter.entity';
import { User } from './user.entity';

export enum FileType {
  VOTER_CARD = 'voter_card',
  IDENTITY_CARD = 'identity_card',
  PASSPORT = 'passport',
  DRIVER_LICENSE = 'driver_license',
  UTILITY_BILL = 'utility_bill',
  OTHER = 'other',
}

@Entity('file_uploads')
@Index(['supporterId'])
@Index(['uploadedByUserId'])
@Index(['createdAt'])
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  supporterId: string;

  @ManyToOne(() => Supporter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supporterId' })
  supporter: Supporter;

  @Column({ type: 'uuid' })
  uploadedByUserId: string;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedByUser: User;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  fileType: FileType;

  @Column({ type: 'varchar', length: 500 })
  fileName: string;

  @Column({ type: 'varchar', length: 500 })
  filePath: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
