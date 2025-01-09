import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./createCategoryDto";

export class updateCategoryDto extends PartialType(CreateCategoryDto) {}
