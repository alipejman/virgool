import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class createCommentDto {
    @ApiProperty()
    @Length(5)
    text: string;
    @ApiProperty()
    @IsNumberString()
    blogId: number
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    parentId: number
}