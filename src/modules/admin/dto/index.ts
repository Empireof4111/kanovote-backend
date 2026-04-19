import { IsString, IsOptional, IsInt, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '@/entities/user-role.enum';

export class CreateLgaDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateWardDto {
  @IsString()
  lgaId: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePollingUnitDto {
  @IsString()
  wardId: string;

  @IsString()
  lgaId: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsInt()
  registeredVoters?: number;
}

export class UpdateLgaDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateWardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePollingUnitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  registeredVoters?: number;
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class DashboardStatsDto {
  totalUsers: number;
  totalAgents: number;
  totalSupporters: number;
  totalRegistrations: number;
}
