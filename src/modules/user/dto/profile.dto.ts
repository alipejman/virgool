import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, Length } from "class-validator";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { userGender } from "../enums/gender.enum";

export class ProfileDto {
    // Other properties of the entity
    @ApiPropertyOptional()
    @IsOptional()
    @Length(3, 50)
    firstName: string;
    @ApiPropertyOptional({nullable:true})
    @IsOptional()
    @Length(3, 50)
    lastName: string;
    @ApiPropertyOptional({nullable:true})
    @IsOptional()
    @Length(10, 200)
    bio: string;
    @ApiPropertyOptional({nullable:true, format: "binary"})
    avatar: string;
    @ApiPropertyOptional({nullable:true})
    age: number;
    @ApiPropertyOptional({nullable:true, enum: userGender})
    @IsOptional()
    @IsEnum(userGender)
    gender: string
    @ApiPropertyOptional({nullable:true})
    birthday: Date;
    @ApiPropertyOptional({nullable:true})
    linkedin: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

}