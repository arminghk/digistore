import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './model/profile.schema';
import { Model } from 'mongoose';
import { User } from './model/user.schema';
import { AuthMessage, ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';
import { AuthService } from '../auth/auth.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        @InjectModel(User.name) private userModel: Model<User>,
        @Inject(REQUEST) private request: Request,
        private authService: AuthService,
        private readonly redisService: RedisService,
       
    ) { }
    async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
        if (files?.image_profile?.length > 0) {
            let [image] = files?.image_profile;
            profileDto.image_profile = image?.path?.slice(7)
        }
        if (files?.bg_image?.length > 0) {
            let [image] = files?.bg_image;
            profileDto.bg_image = image?.path?.slice(7)
        }

        const { _id: userId } = this.request.user as any;

        let profile = await this.profileModel.findOne({ user: userId });

        const { bio, birthday, gender, linkedin_profile, nick_name, x_profile, image_profile, bg_image } = profileDto;

        if (profile) {
            if (nick_name) profile.nick_name = nick_name;
            if (bio) profile.bio = bio;
            if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
            if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
            if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
            if (x_profile) profile.x_profile = x_profile;
            if (image_profile) profile.image_profile = image_profile;
            if (bg_image) profile.bg_image = bg_image;
            await profile.save();
        } else {
            profile = await this.profileModel.create({
                nick_name,
                bio,
                birthday,
                gender,
                linkedin_profile,
                x_profile,
                userId,
                image_profile,
                bg_image,
                user: userId
            })
        }

        return {
            message: PublicMessage.Updated
        }
    }


 
   
}
