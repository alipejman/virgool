import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { authDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerForm } from 'src/common/enums/swaggerForm.enum';
import { ImageDto } from './dto/image.dto';
import { File } from 'src/common/utils/multer.utils';
import { UploadFile } from 'src/common/interceptor/upload.interceptor';

@Controller('image')
@ApiTags('Image')
@authDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}


@Post()
@UseInterceptors(UploadFile('image'))
@ApiConsumes(SwaggerForm.Multipart)
create(@Body() imageDto: ImageDto, @UploadedFile() image: File) {
  return this.imageService.create(imageDto, image)
}

}
