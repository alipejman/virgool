import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileEntity } from '../user/entities/profile.entity';
import { JwtService } from '@nestjs/jwt';
import { tokensService } from './tokens.service';
import { otpEntity } from '../user/entities/otp.entity';
import { googleAuthController } from './google.controller';
import { googleStrategy } from './strategy/google.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity, otpEntity])],
  controllers: [AuthController, googleAuthController],
  providers: [AuthService, JwtService, tokensService, googleStrategy],
  exports: [AuthService, JwtService, tokensService, TypeOrmModule, googleStrategy]
})
export class AuthModule {}
