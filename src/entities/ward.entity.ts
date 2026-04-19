import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { LocalGovernmentArea } from './lga.entity';
import { PollingUnit } from './polling-unit.entity';

@Entity('wards')
@Index(['lgaId', 'code'], { unique: true })
export class Ward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lgaId: string;

  @ManyToOne(() => LocalGovernmentArea, (lga) => lga.wards, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'lgaId' })
  lga: LocalGovernmentArea;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PollingUnit, (pu) => pu.ward, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  pollingUnits: PollingUnit[];
}
