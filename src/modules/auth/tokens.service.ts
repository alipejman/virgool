import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload, cookiePayload } from "./types/cookie.type";
import { AuthMessage } from "src/common/enums/messages.enum";

@Injectable()
export class tokensService {
    constructor(
        private jwtService: JwtService,
    ) {}    



    craeteToken(payload: cookiePayload) {
        const token =  this.jwtService.sign(payload, {
            secret: process.env.OTP_TOKEN_SECRET,
            expiresIn: 60 * 2,
        });
        return token;
    }

    verifyToken(token: string) : cookiePayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.OTP_TOKEN_SECRET,
            });
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.InvaloToken);
        }
    }

    createAccessToken(payload: AccessTokenPayload) {
        const token = this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        });
        return token;
    }

    verifyAccessToken(token: string) : AccessTokenPayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.InvaloToken);
        }
    }
}