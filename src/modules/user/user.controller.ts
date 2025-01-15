import { Body, Controller, Get, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Put, Query, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto } from './dto/profile.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {multerStorage } from 'src/common/utils/multer.util';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { Response } from 'express';
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

  
}
