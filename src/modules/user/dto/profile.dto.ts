
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, Length } from "class-validator"
import { Gender } from "../enum/gender.enum"
import { ValidationMessage } from "src/common/enums/message.enum"

export class ProfileDto {

    @IsOptional()
    @Length(3, 100)
    nick_name: string

    @IsOptional()
    @Length(10, 200)
    bio: string

    image_profile: string

    bg_image: string

    @IsOptional()
    @IsEnum(Gender)
    gender: string

    birthday: Date

    x_profile: string

    linkedin_profile: string
}
export class ChangeEmailDto {
    @IsEmail({}, {message: ValidationMessage.InvalidEmailFormat})
    email: string
}
export class ChangeMobileDto {
    @IsMobilePhone("fa-IR", {}, {message: ValidationMessage.InvalidPhoneFormat})
    mobile: string
}
export class ChangeUsernameDto {
    @IsString()
    @Length(3, 100)
    username: string;
}
