import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileEntity } from '../user/entities/profile.entity';
import { JwtService } from '@nestjs/jwt';
import { tokensService } from './tokens.service';
import { otpEntity } from '../user/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity, otpEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, tokensService],
  exports: [AuthService, JwtService, tokensService, TypeOrmModule]
})
export class AuthModule {}
