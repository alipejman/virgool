import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerForm } from 'src/common/enums/swaggerForm.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('user-existence')
  @ApiTags('Auth')
  @ApiConsumes(SwaggerForm.Urlencode, SwaggerForm.Json)
  async userExistence(@Body() authDto: AuthDto)  {
    return this.authService.userExistence(authDto);
  }
}
