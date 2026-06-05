import { BeforeInsert, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

export abstract class BaseUuidEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
}
