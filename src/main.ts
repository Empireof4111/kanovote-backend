import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { AppModule } from './app.module';

const parseOrigins = (value?: string) =>
  (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  const allowedOrigins = Array.from(
    new Set([
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8081',
      'http://localhost:19006',
      ...parseOrigins(process.env.FRONTEND_URL),
    ]),
  );

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Session middleware
  const PgSession = (pgSession as any)(session);
  
  app.use(
    session({
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
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📝 API Documentation: http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('❌ Application startup error:', err);
  process.exit(1);
});
