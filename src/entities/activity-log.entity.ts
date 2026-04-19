import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum ActivityAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE_SUPPORTER = 'create_supporter',
  UPDATE_SUPPORTER = 'update_supporter',
  VERIFY_SUPPORTER = 'verify_supporter',
  REJECT_SUPPORTER = 'reject_supporter',
  UPLOAD_DOCUMENT = 'upload_document',
  DOWNLOAD_EXPORT = 'download_export',
  CREATE_AGENT = 'create_agent',
  UPDATE_AGENT = 'update_agent',
  DELETE_AGENT = 'delete_agent',
  VIEW_REPORT = 'view_report',
  UPDATE_SETTINGS = 'update_settings',
}

@Entity('activity_logs')
@Index(['userId'])
@Index(['action'])
@Index(['createdAt'])
@Index(['entityType', 'entityId'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.activityLogs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ActivityAction,
  })
  action: ActivityAction;

  @Column({ type: 'varchar', length: 255, nullable: true })
  entityType: string;

  @Column({ type: 'uuid', nullable: true })
  entityId: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
