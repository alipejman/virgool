import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";
import {
  ChangeEmailDto,
  ChangePhoneDto,
  changeUsernameDto,
  ProfileDto,
} from "./dto/profile.dto";
import { SwaggerForm } from "src/common/enums/swaggerForm.enum";
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";
import { multerStorage } from "src/common/utils/multer.utils";
import { AuthGuard } from "../auth/guards/auth.gurad";
import { avatar } from "./types/files";
import { uploadedOptionalFiles } from "src/common/decorators/uploadFiles.decorator";
import { Request, Response } from "express";
import { authDecorator } from "src/common/decorators/auth.decorator";
import { cookieKeys } from "src/common/enums/cookie.enum";
import { CookiesOptionToken } from "src/common/utils/cookie.utils";
import { publicMessage } from "src/common/enums/messages.enum";
import { checkOtpDto } from "../auth/dto/auth.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { paginationsDto } from "src/common/dtos/paginations.dto";

@Controller("user")
@ApiTags("User")
@authDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("/profile")
  @ApiConsumes(SwaggerForm.Multipart)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], {
      storage: multerStorage("avatar"),
    })
  )
  changeProfile(
    @uploadedOptionalFiles()
    files: avatar,
    @Body() profileDto: ProfileDto
  ) {
    console.log("Uploaded Files:", files); // لاگ فایل‌های آپلود شده
    try {
      return this.userService.changeProfile(files, profileDto);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }

  @Get("/profile")
  getUserProfile(@Req() request: Request) {
    return this.userService.GetProfile();
  }

  @Patch("/change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, message, token } = await this.userService.changeEmail(
      emailDto.email
    );
    if (message) return res.json({ message });
    res.cookie(cookieKeys.EmailOtp, token, CookiesOptionToken());
    res.json({
      code,
      message: publicMessage.sendOtp,
    });
  }

  @Post("/verify-email-otp")
  async verifyEmail(@Body() otpDto: checkOtpDto) {
    return this.userService.verifyEmail(otpDto.code);
  }

  @Patch("/change-phone")
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, message, token } = await this.userService.changePhone(
      phoneDto.phone
    );
    if (message) return res.json({ message });
    res.cookie(cookieKeys.PhoneOtp, token, CookiesOptionToken());
    res.json({
      code,
      message: publicMessage.sendOtp,
    });
  }

  @Post("/verify-phone-otp")
  async verifyPhone(@Body() otpDto: checkOtpDto) {
    return this.userService.verifyPhone(otpDto.code);
  }

  @Patch("/change-username")
  async changeUsername(@Body() usernameDto: changeUsernameDto) {
    return this.userService.changeUsername(usernameDto.username);
  }

  @Get("/follow/:followerId")
  @ApiParam({ name: "followerId" })
  follow(@Param("followerId", ParseIntPipe) followerId: number) {
    return this.userService.followToggle(followerId);
  }

  @Get("/followers")
  @Pagination()
  followers(@Query() paginationDto: paginationsDto) {
    return this.userService.followers(paginationDto);
  }

  @Get('/following')
  @Pagination()
  following(@Query() paginationDto: paginationsDto) {
    return this.userService.following(paginationDto)
  }

}
