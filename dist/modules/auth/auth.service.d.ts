import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto, ResetPasswordDto, SetNewPasswordDto } from './dto';
import { User } from '@/entities/user.entity';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            username: string;
            role: import("@/entities/user.entity").UserRole;
            phone: string;
            isEmailVerified: boolean;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            username: string;
            role: import("@/entities/user.entity").UserRole;
            phone: string;
            isEmailVerified: boolean;
        };
    }>;
    requestPasswordReset(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
        resetToken: string;
    }>;
    setNewPassword(setNewPasswordDto: SetNewPasswordDto): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map