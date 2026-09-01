import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@/entities/user-role.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async onApplicationBootstrap() {
    if (this.configService.get<string>('BOOTSTRAP_ADMIN_ENABLED') !== 'true') {
      return;
    }

    const firstName = this.configService.get<string>('BOOTSTRAP_ADMIN_FIRST_NAME');
    const lastName = this.configService.get<string>('BOOTSTRAP_ADMIN_LAST_NAME');
    const email = this.configService.get<string>('BOOTSTRAP_ADMIN_EMAIL')?.toLowerCase();
    const username = this.configService.get<string>('BOOTSTRAP_ADMIN_USERNAME');
    const phone = this.configService.get<string>('BOOTSTRAP_ADMIN_PHONE');
    const password = this.configService.get<string>('BOOTSTRAP_ADMIN_PASSWORD');

    if (!firstName || !lastName || !email || !username || !phone || !password) {
      this.logger.error('Admin bootstrap is enabled but one or more BOOTSTRAP_ADMIN_* values are missing.');
      return;
    }

    const existingEmail = await this.userService.findByEmail(email);
    if (existingEmail) {
      this.logger.log(`Bootstrap admin ${email} already exists; no changes made.`);
      return;
    }

    const existingUsername = await this.userService.findByUsername(username);
    if (existingUsername) {
      this.logger.error(`Bootstrap admin username ${username} is already in use; no account was created.`);
      return;
    }

    await this.userService.create({
      firstName,
      lastName,
      email,
      username,
      phone,
      password: await bcrypt.hash(password, 10),
      role: UserRole.SUPER_ADMIN,
    });

    this.logger.log(`Bootstrap super-admin ${email} created successfully.`);
  }
}