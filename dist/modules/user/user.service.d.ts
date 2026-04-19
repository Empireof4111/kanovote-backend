import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';
import { CreateUserDto } from './dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByResetToken(token: string): Promise<User | null>;
    findAll(skip?: number, take?: number): Promise<[User[], number]>;
    updateLastLogin(userId: string): Promise<void>;
    updateResetToken(userId: string, token: string, expiry: Date): Promise<void>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
    updateProfile(userId: string, updateData: Partial<User>): Promise<User>;
    verifyEmail(userId: string): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
    activateUser(userId: string): Promise<void>;
    getUsersByRole(role: UserRole, skip?: number, take?: number): Promise<[User[], number]>;
}
//# sourceMappingURL=user.service.d.ts.map