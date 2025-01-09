import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { AuthMessage } from "src/common/enums/messages.enum";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);

    // اعتبارسنجی توکن و دریافت اطلاعات کاربر
    const user = await this.authService.validateAccessToken(token);
    if (!user) {
      throw new UnauthorizedException(AuthMessage.InvaloToken);
    }

    // اضافه کردن اطلاعات کاربر به درخواست
    request.user = user;
    return true; // اجازه دسترسی به کاربر
  }

  protected extractToken(request: Request): string {
    const { authorization } = request.headers;
    if (
      !authorization ||
      !authorization.startsWith("Bearer ") ||
      authorization.trim() === ""
    ) {
      throw new UnauthorizedException(AuthMessage.NotLoginPleaseLogin);
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
      throw new UnauthorizedException(AuthMessage.InvaloToken);
    }
    return token;
  }
}
