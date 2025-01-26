import {
  BadRequestException,
  ConflictException,
  Inject,
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
import { tokensService } from "./tokens.service";
import { Request, Response } from "express";
import { cookieKeys } from "src/common/enums/cookie.enum";
import { AuthResponse } from "./types/response";
import { Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { CookiesOptionToken } from "src/common/utils/cookie.utils";
import { KavenegarService } from "../http/kavenegar.service";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(otpEntity)
    private readonly otpRepository: Repository<otpEntity>,
    private tokenService: tokensService,
    @Inject(REQUEST) private request: Request,
    private kavenegarService: KavenegarService
  ) {}

  // Check user existence
  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        await this.sendOtp(method, username, result.code);
        return this.sendResponse(res, result);
      case AuthType.Register:
        result = await this.register(method, username);
        await this.sendOtp(method, username, result.code);
        return this.sendResponse(res, result);
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
  async saveOtp(userId: number, method: AuthMethod) {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresIn = new Date(Date.now() + 60000);
    let existsOtp = false;
    let otp = await this.otpRepository.findOneBy({ userId });
    if (otp) {
      existsOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
      otp.method = method;
    } else {
      otp = await this.otpRepository.create({
        code,
        expiresIn,
        userId,
        method,
      });
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
    const otp = await this.saveOtp(user.id, method);
    const token = this.tokenService.craeteToken({ userId: user.id });
    return {
      code: otp.code,
      token,
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
    const otp = await this.saveOtp(user.id, method);
    const token = this.tokenService.craeteToken({ userId: user.id });
    return {
      code: otp.code,
      token,
    };
  }

  async sendOtp(method: AuthMethod, username: string, code: string) {
    if (method === AuthMethod.Email) {
      //sendEmail
    } else if (method === AuthMethod.Phone) {
      await this.kavenegarService.sendVerificationSms(username, code);
    }
  }

  // Send Response
  async sendResponse(res: Response, result: AuthResponse) {
    const { token } = result;
    res.cookie(cookieKeys.xhssp, token, CookiesOptionToken());
    return res.json({
      message: "کد یک بار مصرف ارسال شد",
    });
  }

  // Check OTP
  async checkOtp(code: string) {
    const token = this.request.cookies?.[cookieKeys.xhssp];
    if (!token) throw new UnauthorizedException(AuthMessage.ExistAccount);
    const { userId } = this.tokenService.verifyToken(token);
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.ExistAccount);
    const now = new Date();
    if (now > otp.expiresIn)
      throw new UnauthorizedException(AuthMessage.InvaloToken);
    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.InvaloToken);
    const accessToken = this.tokenService.createAccessToken({ userId });
    if (otp.method === AuthMethod.Email) {
      await this.userRepository.update(
        { id: userId },
        {
          verifyEmail: true,
        }
      );
    } else if (otp.method === AuthMethod.Phone) {
      await this.userRepository.update(
        { id: userId },
        {
          verifyPhone: true,
        }
      );
    }
    return {
      message: AuthMessage.SignIn,
      accessToken,
    };
  }

  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.InvaloToken);
    return user;
  }
}
