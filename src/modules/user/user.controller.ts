import { Body, Controller, Get, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Put, Query, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto } from './dto/profile.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerDestination, multerFilename, multerStorage } from 'src/common/utils/multer.util';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/enums/message.enum';
// import { CheckOtpDto, UserBlockDto } from '../auth/dto/auth.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
// import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';


@Controller('user')
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put("/profile")
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: "image_profile", maxCount: 1 },
      { name: "bg_image", maxCount: 1 },
    ], {
    storage: multerStorage("user-profile")
  }
  ))
  changeProfile(
    @UploadedOptionalFiles() files: ProfileImages,
    @Body() profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto)
  }


  @Patch("/change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    // const {code, token, message} = await this.userService.changeEmail(emailDto.email)
    // if(message) return res.json({message});
    // res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
    // res.json({
    //   code,
    //   message: PublicMessage.SentOtp
    // })
  }
}
