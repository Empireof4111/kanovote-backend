"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        credentials: true,
    });
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    // Session middleware
    const PgSession = connect_pg_simple_1.default(express_session_1.default);
    app.use((0, express_session_1.default)({
        store: new PgSession({
            conString: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET || 'your-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📝 API Documentation: http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
    console.error('❌ Application startup error:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map