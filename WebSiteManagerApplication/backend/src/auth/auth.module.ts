import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/LocalStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { JwtStrategy } from './jwt.strategy';
import { Entreprise, EntrepriseSchema } from 'src/Module/entreprise/schemas/entreprise.schema';

@Module({
  imports: [
    
    
    PassportModule.register({ defaultStrategy: 'jwt' , session: true}),
   
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },
    ]),
    MongooseModule.forFeature([{ name: Entreprise.name, schema: EntrepriseSchema }]),
    
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,LocalStrategy,SessionSerializer],
  exports: [PassportModule,AuthService,MongooseModule],

})
export class AuthModule {}
