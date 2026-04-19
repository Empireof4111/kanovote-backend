import { UserRole } from '@/entities/user-role.enum';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
}
export declare class VerifyEmailDto {
    token: string;
}
//# sourceMappingURL=index.d.ts.map