import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class CraeteBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(10, 150)
    title: string

    @ApiPropertyOptional()
    slug: string

    @ApiProperty()
    @IsNotEmpty()
    time_for_study: string

    @ApiPropertyOptional()
    image: string

    @ApiProperty()
    @IsNotEmpty()
    @Length(10, 300)
    description: string

    @ApiProperty()
    @IsNotEmpty()
    @Length(100)
    content: string

    @ApiProperty({type: String, isArray: true})
    categories: string[] | string
}

export class UpdateBlogDto extends PartialType(CraeteBlogDto){}


export class FilterBlogDto {
    category: string;
    search: string;
}