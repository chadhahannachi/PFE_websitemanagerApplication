import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
       .setTitle('API Documentation')
       .setDescription('Documentation Swagger de l\'API')
       .setVersion('1.0')
       .addBearerAuth()
       .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


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
    origin: ['http://localhost:3000', 'http://127.0.0.1:8000','http://localhost:3001'], // Allow both frontend and Laravel backend
    // origin: true, // Allow all origins during development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
