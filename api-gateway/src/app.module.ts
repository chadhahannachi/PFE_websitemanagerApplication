import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LicenseController } from './controllers/license.controller';
import { LicenseService } from './services/license.service';
import { HealthController } from './controllers/health.controller'; // added import statement

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule,
  ],
  controllers: [LicenseController, HealthController], // added HealthController to controllers array
  providers: [LicenseService],
})
export class AppModule {} 