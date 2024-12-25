import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import {AuthGuard} from "../auth/guards/AuthGuard";
import {Request} from "express";
import { ProfileDto,ChangeEmailDto } from './dto/profile.dto';
import { multerDestination, multerFilename, multerStorage } from 'src/common/utils/multer.util';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { ProfileImages } from './types/files';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';


@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

 
  @Get('/profile')
  findAll(@Req() request:Request) {
    return request.user
  }

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
    return this.userService.changeProfile(files,profileDto)
  }

 
}
