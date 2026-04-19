import { IsString, IsEnum, IsOptional, IsInt, Min, IsEmail, MinLength, Matches } from 'class-validator';
import { Match } from '@/common/decorators/match.decorator';
import { UserRole } from '@/entities/user.entity';
import { AgentStatus } from '@/entities/agent.entity';

// For creating agents via registration (includes user creation)
export class RegisterAgentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[\d+\-() ]+$/, { message: 'Invalid phone number' })
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  state: string;

  @IsString()
  lga: string;

  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// For creating agents when user already exists
export class CreateAgentDto {
  @IsString()
  userId: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  state: string;

  @IsString()
  lga: string;

  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// For updating agent details
export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  lga?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsEnum(AgentStatus)
  status?: AgentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

// For resetting agent password
export class ResetPasswordDto {
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;

  @IsString()
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}

// For querying agents
export class AgentPerformanceDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  lga?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
