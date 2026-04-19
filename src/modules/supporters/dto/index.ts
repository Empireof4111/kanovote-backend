import { IsString, IsEmail, IsDateString, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { VerificationStatus } from '@/entities/supporter.entity';

export class CreateSupporterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber('NG')
  phone: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsString()
  occupation: string;

  @IsString()
  state: string;

  @IsString()
  lga: string;

  @IsString()
  ward: string;

  @IsString()
  pollingUnit: string;

  @IsString()
  address: string;

  @IsString()
  voterCardNumber: string;
}

export class UpdateSupporterDto {
  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  pollingUnit?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(VerificationStatus)
  status?: VerificationStatus;

  @IsOptional()
  @IsString()
  verificationNotes?: string;
}

export class VerifySupporterDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
