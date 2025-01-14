import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
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


}

export class ChangeEmailDto {

    @ApiProperty()
    @IsEmail({}, {message: "فرمت ایمیل نادرست میباشد"})
    email: string
}

export class ChangePhoneDto {
    @ApiProperty()
    @IsMobilePhone('fa-IR', {}, {message: "فرمت موبایل نادرست میباشد"})
    phone: string

}

export class changeUsernameDto {
    @ApiProperty()
    @Length(3, 50)
    @IsString()
    username: string
}