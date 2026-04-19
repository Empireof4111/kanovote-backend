import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { AgentModule } from './modules/agents/agents.module';
import { SupporterModule } from './modules/supporters/supporters.module';
import { RegistrationModule } from './modules/registrations/registrations.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { ActivityModule } from './modules/activity/activity.module';
import { ExportModule } from './modules/export/export.module';
import { AdminModule } from './modules/admin/admin.module';
import { User } from './entities/user.entity';
import { Agent } from './entities/agent.entity';
import { Supporter } from './entities/supporter.entity';
import { Registration } from './entities/registration.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { FileUpload } from './entities/file-upload.entity';
import { LocalGovernmentArea } from './entities/lga.entity';
import { Ward } from './entities/ward.entity';
import { PollingUnit } from './entities/polling-unit.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: configService.get<string>('DATABASE_NAME', 'kano_registration_db'),
        entities: [
          User,
          Agent,
          Supporter,
          Registration,
          ActivityLog,
          FileUpload,
          LocalGovernmentArea,
          Ward,
          PollingUnit,
        ],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
        dropSchema: false,
      }),
    }),
    AuthModule,
    AgentModule,
    SupporterModule,
    RegistrationModule,
    FileUploadModule,
    ActivityModule,
    ExportModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
