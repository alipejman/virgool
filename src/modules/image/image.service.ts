import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
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

   findAll() {
    const userId = this.request.user.id;
    return this.imageRepository.findOne({
        where: {userId},
        order: {id: "DESC"}
    })
  }

  async findOne(id: number) {
    const userId = this.request.user.id;
    const image = await this.imageRepository.findOne({
        where: {userId, id},
        order: {id: "DESC"}
    });
    if(!image) throw new NotFoundException(publicMessage.somthinWrong);
    return image;
  }

  async remove(id: number) {
    const image = await this.findOne(id)
    await this.imageRepository.remove(image);
    return {
        message: publicMessage.remove
    }
  }
}
