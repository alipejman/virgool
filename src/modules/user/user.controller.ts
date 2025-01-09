import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ProfileDto } from "./dto/profile.dto";
import { SwaggerForm } from "src/common/enums/swaggerForm.enum";
import {  FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "src/common/utils/multer.utils";
import { AuthGuard } from "../auth/guards/auth.gurad";
import { avatar } from "./types/files";
import { uploadedOptionalFiles } from "src/common/decorators/uploadFiles.decorator";
import { Request } from "express";
import { authDecorator } from "src/common/decorators/auth.decorator";

@Controller("user")
@ApiTags("User")
@authDecorator()

export class UserController {
  constructor(private readonly userService: UserService) {}



  @Put("/profile")
  @ApiConsumes(SwaggerForm.Multipart)
  @UseInterceptors(FileFieldsInterceptor([
    {name: "avatar", maxCount: 1}
  ], {
    storage: multerStorage("avatar")
  }))
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

  @Get('/profile')
  getUserProfile(@Req() request: Request) {
      return this.userService.GetProfile();
  }
  
}
