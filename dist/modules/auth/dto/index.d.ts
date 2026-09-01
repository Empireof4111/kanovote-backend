export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phone: string;
}
export declare class ResetPasswordDto {
    email: string;
}
export declare class SetNewPasswordDto {
    token: string;
    newPassword: string;
}
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
//# sourceMappingURL=index.d.ts.map