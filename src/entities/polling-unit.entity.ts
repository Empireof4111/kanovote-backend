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
import { Ward } from './ward.entity';
import { LocalGovernmentArea } from './lga.entity';

@Entity('polling_units')
@Index(['code'], { unique: true })
export class PollingUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  wardId: string;

  @Column({ type: 'uuid' })
  lgaId: string;

  @ManyToOne(() => Ward, (ward) => ward.pollingUnits, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'wardId' })
  ward: Ward;

  @ManyToOne(() => LocalGovernmentArea, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'lgaId' })
  lga: LocalGovernmentArea;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'int', default: 0 })
  registeredVoters: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
