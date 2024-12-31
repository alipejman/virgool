import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthType } from "./enums/type.enum";
import { AuthMethod } from "./enums/method.enum";
import {
  AuthMessage,
  BadRequestExeption,
} from "src/common/enums/messages.enum";
import { validateEmail, validatePhoneNumber } from "src/common/utils/validator";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "../user/entities/profile.entity";
import { otpEntity } from "../user/entities/otp.entity";
import { IsEmail, IsMobilePhone } from "class-validator";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(otpEntity)
    private readonly otpRepository: Repository<otpEntity>
  ) {}

  // Check user existence
  async userExistence(authDto: AuthDto) {
    const { method, type, username } = authDto;
    console.log(username);
    console.log(type);
    console.log(method);
    switch (type) {
      case AuthType.Login:
        return this.login(method, username);
      case AuthType.Register:
        return this.register(method, username);
      default:
        throw new UnauthorizedException(AuthMessage.InValidType);
    }
  }

  // Validate username based on the method
  userNameValidation(method: AuthMethod, username) {
    switch (method) {
      case AuthMethod.Email:
        if (validateEmail(username)) return username;
        throw new UnauthorizedException(BadRequestExeption.Email);
      case AuthMethod.Phone:
        if (validatePhoneNumber(username)) return username;
        throw new UnauthorizedException(BadRequestExeption.Phone);
      case AuthMethod.Username:
        return username;
      default:
        throw new UnauthorizedException(AuthMessage.InValidType);
    }
  }

  // Check user exist User
  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity;
    if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({ phone: username });
    } else if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({ email: username });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({ username: username });
    } else {
      throw new UnauthorizedException(AuthMessage.NotFoundAccount);
    }
    return user;
  }

  // save OTP
  async saveOtp(userId: number) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresIn = new Date(Date.now() + 60000);
    let existsOtp = false;
    let otp = await this.otpRepository.findOneBy({ userId });
    if (otp) {
      existsOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = await this.otpRepository.create({ code, expiresIn, userId });
    }
    otp = await this.otpRepository.save(otp);
    if (!existsOtp) {
      await this.userRepository.update(userId, { otpId: otp.id });
    }
    return otp;
  }

  // Login user
  async login(method: AuthMethod, username: string) {
    const validUsername = this.userNameValidation(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);
    const otp = await this.saveOtp(user.id);
    return {
      Code: otp.code,
    };
  }

  // Register user
  async register(method: AuthMethod, username: string) {
    const validUsername = this.userNameValidation(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (user) throw new ConflictException(AuthMessage.ExistAccount);
    if (method === AuthMethod.Username) {
      throw new BadRequestException(AuthMessage.InValidType);
    }
    user = await this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `user-${user.id}`;
    await this.userRepository.save(user);
    const otp = await this.saveOtp(user.id);
    return {
      Code: otp.code,
    };
  }

  // Check OTP
  async checkOtp() {}
}
