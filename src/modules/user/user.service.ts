import { Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { ProfileDto } from "./dto/profile.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { Request } from "express";
import { isDate } from "class-validator";
import { userGender } from "./enums/gender.enum";
import { User } from "src/common/enums/messages.enum";
import { avatar } from "./types/files";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @Inject("REQUEST") private request: Request
  ) {}


  async changeProfile(files: avatar, profileDto: ProfileDto) {
    if (files?.avatar?.length > 0) {
        let [image] = files.avatar; 
        console.log('Image Path:', image.path);
        profileDto.avatar = image.path; 
    }

    const { id: userId, profileId } = await this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const { firstName, lastName, bio, gender, linkedin, birthday, avatar } = profileDto;
    const age = Number(profileDto.age);

    if (profile) {
        // به‌روزرسانی پروفایل موجود
        if (firstName) profile.firstName = firstName;
        if (lastName) profile.lastName = lastName;
        if (bio) profile.bio = bio;
        if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
        if (gender && Object.values(userGender as any).includes(gender)) profile.gender = gender;
        if (linkedin) profile.linkedin = linkedin;
        if (avatar) profile.avatar = avatar; 
        if (age && age > 0 && age < 100 && Number.isInteger(age)) {
            profile.age = age;
        }

        profile = await this.profileRepository.save(profile);
    } else {
        profile = this.profileRepository.create({
            userId,
            firstName,
            lastName,
            bio,
            age,
            linkedin,
            avatar: profileDto.avatar
        });
        profile = await this.profileRepository.save(profile); 
    }

    if (!profileId) {
        await this.userRepository.update(userId, { profileId: profile.id });
    }
    return {
        Message: User.UpdatedProfile
    };
  }



  GetProfile() {
    const user = this.request.user;
    if (!user) {
        throw new UnauthorizedException('User not found');
    }
    const { id } = user;
    return this.userRepository.findOne({
        where: { id },
        relations: ["profile"]
    });
}



}