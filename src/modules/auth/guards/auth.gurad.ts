import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { AuthMessage } from "src/common/enums/messages.enum";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,  private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
        if(isSkippedAuthorization) return true;
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);

    const user = await this.authService.validateAccessToken(token);
    if (!user) {
      throw new UnauthorizedException(AuthMessage.InvaloToken);
    }

    request.user = user;


    if(request?.user?.status === "Blocked") throw new ForbiddenException(AuthMessage.UserBlocked);

    return true; 
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
