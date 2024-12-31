import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileEntity } from '../user/entities/profile.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
