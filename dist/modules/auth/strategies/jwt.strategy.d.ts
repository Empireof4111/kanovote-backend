import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(payload: {
        sub: string;
        email: string;
        iat: number;
        exp: number;
    }): Promise<import("../../../entities/user.entity").User>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map