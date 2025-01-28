import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { ProfileDto } from "./dto/profile.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { Request } from "express";
import { isDate } from "class-validator";
import { userGender } from "./enums/gender.enum";
import { AuthMessage, publicMessage, User } from "src/common/enums/messages.enum";
import { avatar } from "./types/files";
import { AuthService } from "../auth/auth.service";
import { tokensService } from "../auth/tokens.service";
import { cookieKeys } from "src/common/enums/cookie.enum";
import { AuthMethod } from "../auth/enums/method.enum";
import { otpEntity } from "./entities/otp.entity";
import { userInfo } from "os";
import { FollowEntity } from "./entities/follow.entity";
import { paginationsDto } from "src/common/dtos/paginations.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.solver";
import { identity } from "rxjs";
import { UserBlockDto } from "../auth/dto/auth.dto";
import { userStatus } from "./enums/status.enum";
import { Roles } from "../auth/enums/role.enum";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @Inject("REQUEST") private request: Request,
    private authService: AuthService,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    private tokenService: tokensService,
    @InjectRepository(otpEntity)
    private otpRepository: Repository<otpEntity>,
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



  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({email})
    if(user && user.id !== id) {
        throw new ConflictException(User.ExistEmail)
    } else if(user && user.id == id) {
        return {
            message: User.UpdatedProfile
        }
    }
    await this.userRepository.update({id}, {newEmail: email})
    const otp = await this.authService.saveOtp(id, AuthMethod.Email)
    const token = this.tokenService.createEmailToken({email});
    return {
        code: otp.code,
        token
    }
  }

  async verifyEmail(code: string) {
    const {id: userId, newEmail} = this.request.user;
    const token = this.request.cookies?.[cookieKeys.EmailOtp];
        if(!token) throw new BadRequestException(AuthMessage.ExistAccount);
        const {email} =  this.tokenService.verifyEmailToken(token);
    const otp = await this.checkOtp(userId, code);
    if(email !== newEmail) throw new BadRequestException(publicMessage.somthinWrong);
    if(otp.method !== AuthMethod.Email) throw new BadRequestException(publicMessage.somthinWrong);
    await this.userRepository.update({id: userId}, {
        verifyEmail: true,
        email,
        newEmail: null
    })
     return {
        message: User.UpdatedProfile
     }
}


async changePhone(phone: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({phone})
    if(user && user.id !== id) {
        throw new ConflictException(User.ExistPhone)
    } else if(user && user.id == id) {
        return {
            message: User.UpdatedProfile
        }
    }
    await this.userRepository.update({id}, {newPhone: phone})
    const otp = await this.authService.saveOtp(id, AuthMethod.Phone)
    const token = this.tokenService.createPhoneToken({phone});
    return {
        code: otp.code,
        token
    }
  }

  async verifyPhone(code: string) {
    const {id: userId, newPhone} = this.request.user;
    const token = this.request.cookies?.[cookieKeys.PhoneOtp];
        if(!token) throw new BadRequestException(AuthMessage.ExistAccount);
        const {phone} =  this.tokenService.verifyPhoneToken(token);
    const otp = await this.checkOtp(userId, code);
    if(phone !== newPhone) throw new BadRequestException(publicMessage.somthinWrong);
    if(otp.method !== AuthMethod.Phone) throw new BadRequestException(publicMessage.somthinWrong);
    await this.userRepository.update({id: userId}, {
        verifyPhone: true,
        phone,
        newPhone: null
    })
     return {
        message: User.UpdatedProfile
     }
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




async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({userId});
    if(!otp) throw new BadRequestException(AuthMessage.NotFoundAccount);
        const now = new Date();
        if(now > otp.expiresIn) throw new BadRequestException(AuthMessage.InvaloToken);
        if(otp.code !== code) throw new BadRequestException(AuthMessage.InvaloToken);
        return otp;
}


async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({username})
    if(user && user.id !== id) {
        throw new ConflictException(User.ExistUsername)
    } else if(user && user.id == id) {
        return {
            message: User.UpdatedProfile
        }
    }
    await this.userRepository.update({id}, {username});
    return {
        message: User.UpdatedProfile
    }
}



    async followToggle(followingId: number) {
        const {id: userId} = this.request.user;
        const following = await this.userRepository.findOneBy({id: followingId});
        if(!following) throw new BadRequestException(User.NotFoundUser);
        const isFollowing = await this.followRepository.findOneBy({followingId, followerId: userId});
        let message = User.Followed;
        if(!isFollowing) {
            message = User.UnFollow;
            await this.followRepository.remove(isFollowing);
        } else {
            await this.followRepository.insert({followingId, followerId: userId});
        }
        return {
            message
        }
    }


    async followers(paginationDto: paginationsDto) {
        const {limit, page, skip} = paginationSolver(paginationDto);
        const {id: userId} = this.request.user;
        const [followers, count] = await this.followRepository.findAndCount({
            where: {followingId: userId},
            relations: {
                follower: {
                    profile: true
                }
            },
            select: {
                id: true,
                follower: {
                    id: true,
                    username: true,
                    profile: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        bio: true,
                        avatar: true
                    }
                }
            },
            skip,
            take: limit
        })

        return {
          pagination:   paginationGenerator(count, page, limit)  ,
          followers
        } 

    }


    async following(paginationDto: paginationsDto) {
        const {limit, page, skip} = paginationSolver(paginationDto);
        const {id: userId} = this.request.user;
        const [ following, count] = await this.followRepository.findAndCount({
            where: {followerId: userId},
            relations: {
                following: {
                    profile: true
                }
            },
            select: {
                id: true,
                following: {
                    id: true,
                    username: true,
                    profile: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        bio: true,
                        avatar: true
                    }
                }
            },
            skip,
            take: limit
        })
        return {
            pagination: paginationGenerator(count, page, limit),
            following
        }
    }


    async blockToggle(blockDto: UserBlockDto) {
        const {userId} = blockDto;
        const user = await this.userRepository.findOneBy({id: userId});
        if(!user) throw new BadRequestException(User.NotFoundUser);
        let message = User.Blocked;
        if(user.status === userStatus.Blocked) {
            message = User.UnBlocked;
            await this.userRepository.update({id: userId}, {status: null});
        } else {
            await this.userRepository.update({id: userId}, {status: userStatus.Blocked});
        }
        return {
            message
        }
    }

}