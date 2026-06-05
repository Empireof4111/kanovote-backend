import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Ward } from './ward.entity';
import { BaseUuidEntity } from './base-uuid.entity';

@Entity('local_government_areas')
@Index(['code'], { unique: true })
export class LocalGovernmentArea extends BaseUuidEntity {

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

  @OneToMany(() => Ward, (ward) => ward.lga, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  wards: Ward[];
}
