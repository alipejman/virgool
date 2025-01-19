import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageEntity } from "./entities/image.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { ImageDto } from "./dto/image.dto";
import { File } from "src/common/utils/multer.utils";
import { publicMessage } from "src/common/enums/messages.enum";

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(imageDto: ImageDto, image: File) {
    const userId = this.request.user.id;
    const { alt, name } = imageDto;
    let location = image?.path?.slice(7);
    await this.imageRepository.insert({
      alt: alt || name,
      name,
      location,
      userId,
    });
    return {
      message: publicMessage.created,
    };
  }
}
