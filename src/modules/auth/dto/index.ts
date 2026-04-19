import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}

export class RegisterDto {
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
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

export class SetNewPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;
}
