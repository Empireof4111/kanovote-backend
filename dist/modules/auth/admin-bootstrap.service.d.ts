import { OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
export declare class AdminBootstrapService implements OnApplicationBootstrap {
    private readonly configService;
    private readonly userService;
    private readonly logger;
    constructor(configService: ConfigService, userService: UserService);
    onApplicationBootstrap(): Promise<void>;
}
//# sourceMappingURL=admin-bootstrap.service.d.ts.map