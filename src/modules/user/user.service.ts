import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['agents'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async findAll(skip = 0, take = 10): Promise<[User[], number]> {
    return this.userRepository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }

  async updateResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await this.userRepository.update(userId, {
      resetPasswordToken: token,
      resetPasswordTokenExpiry: expiry,
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword,
      resetPasswordToken: '' as any,
      resetPasswordTokenExpiry: null as any,
    });
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, updateData);
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isEmailVerified: true,
      emailVerificationToken: '' as any,
      emailVerifiedAt: new Date(),
    });
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isActive: false });
  }

  async activateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isActive: true });
  }

  async getUsersByRole(role: UserRole, skip = 0, take = 10): Promise<[User[], number]> {
    return this.userRepository.findAndCount({
      where: { role },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }
}
