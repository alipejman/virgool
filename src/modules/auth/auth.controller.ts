import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, checkOtpDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerForm } from 'src/common/enums/swaggerForm.enum';
import { Request, RequestHandler, Response } from 'express';
import { cookieKeys } from 'src/common/enums/cookie.enum';
import { Code } from 'typeorm';
import { AuthGuard } from './guards/auth.gurad';
import { tokensService } from './tokens.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('user-existence')
  @ApiTags('Auth')
  @ApiConsumes(SwaggerForm.Urlencode, SwaggerForm.Json)
  userExistence(@Body() authDto: AuthDto, @Res() res : Response)  {
    return this.authService.userExistence(authDto, res);
     
  }
  @Post('check-otp')
  @ApiTags('Auth')
  @ApiConsumes(SwaggerForm.Urlencode, SwaggerForm.Json)
  checkOtp(@Body() checkOtpDto: checkOtpDto)  {
    return this.authService.checkOtp(checkOtpDto.code);
     
  }
  
  
  @Get('check-login')
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
   checkLogin(@Req() req: Request)  {
    return  req.user;
  }


}
