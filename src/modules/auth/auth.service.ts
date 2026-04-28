import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, ResetPasswordDto, SetNewPasswordDto } from './dto';
import { AgentStatus } from '@/entities/agent.entity';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact an administrator.');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return null;
    }

    if (
      (user.role === UserRole.FIELD_AGENT || user.role === UserRole.SUPERVISOR) &&
      user.agents?.some((agent) => agent.status !== AgentStatus.ACTIVE)
    ) {
      throw new UnauthorizedException('Your agent account is inactive. Please contact an administrator.');
    }

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    
    // Update last login
    await this.userService.updateLastLogin(user.id);

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: 86400,
      }),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const existingUsername = await this.userService.findByUsername(registerDto.username);
    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const existingUsersCount = await this.userService.countAll();
    const role =
      existingUsersCount === 0 ? UserRole.SUPER_ADMIN : UserRole.FIELD_AGENT;

    // Create user
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      role,
    });

    return this.login(user);
  }

  async requestPasswordReset(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    await this.userService.updateResetToken(user.id, resetToken, resetTokenExpiry);

    return {
      message: 'Password reset link sent to your email',
      resetToken, // In production, send via email
    };
  }

  async setNewPassword(setNewPasswordDto: SetNewPasswordDto) {
    const user = await this.userService.findByResetToken(setNewPasswordDto.token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(setNewPasswordDto.newPassword, 10);
    await this.userService.updatePassword(user.id, hashedPassword);

    return {
      message: 'Password reset successfully',
    };
  }
}
