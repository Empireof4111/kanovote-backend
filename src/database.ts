import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Agent } from './entities/agent.entity';
import { Supporter } from './entities/supporter.entity';
import { Registration } from './entities/registration.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { FileUpload } from './entities/file-upload.entity';

dotenv.config();

const isEnabled = (value?: string) =>
  ['true', '1', 'yes', 'on'].includes((value ?? '').toLowerCase());

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432') || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'kano_registration_db',
  entities: [User, Agent, Supporter, Registration, ActivityLog, FileUpload],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  synchronize: isEnabled(process.env.DATABASE_SYNCHRONIZE),
  logging: isEnabled(process.env.DATABASE_LOGGING),
  dropSchema: false,
});
