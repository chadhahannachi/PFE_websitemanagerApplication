import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret:  process.env.JWT_SECRET, 
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: false }, 
    }),
  );
  app.enableCors({
    // origin: 'http://localhost:3000', 
    origin: ['http://localhost:3000', 'http://127.0.0.1:8000'], // Allow both frontend and Laravel backend
    // origin: true, // Allow all origins during development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
