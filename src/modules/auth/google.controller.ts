import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@Controller("/auth/google")
@ApiTags("Google Auth")
@UseGuards(AuthGuard("google"))
export class googleAuthController {
    constructor(private authService: AuthService) {}

    @Get()
    googleLogin(@Req() req) {}

    @Get('/redirect')
    googleLoginRedirect(@Req() req) {
        const userData = req.user;
        return this.authService.googleAuth(userData);
    }
}