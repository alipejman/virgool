import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { cookiePayload } from "./types/cookie.type";

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
}