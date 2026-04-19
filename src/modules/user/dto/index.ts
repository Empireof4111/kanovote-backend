import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { UserRole } from '@/entities/user-role.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  lastName: string;

  @IsString()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @IsString()
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}

export class VerifyEmailDto {
  @IsString()
  token: string;
}
