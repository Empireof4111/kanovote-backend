import { AuthService } from './auth.service';
import { RegisterDto, ResetPasswordDto, SetNewPasswordDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            username: string;
            role: import("../../entities/user.entity").UserRole;
            phone: string;
            isEmailVerified: boolean;
        };
    }>;
    login(req: any, session: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            username: string;
            role: import("../../entities/user.entity").UserRole;
            phone: string;
            isEmailVerified: boolean;
        };
    }>;
    getProfile(req: any): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        username: any;
        role: any;
        phone: any;
        isEmailVerified: any;
        createdAt: any;
    }>;
    logout(session: any): Promise<{
        message: string;
    }>;
    requestPasswordReset(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
        resetToken: string;
    }>;
    setNewPassword(setNewPasswordDto: SetNewPasswordDto): Promise<{
        message: string;
    }>;
    refreshToken(req: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            username: string;
            role: import("../../entities/user.entity").UserRole;
            phone: string;
            isEmailVerified: boolean;
        };
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map