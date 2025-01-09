import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto ,VerifyOtpDto,SignupDto, LoginDto } from './dto/otp.dto';
import { ApiTags ,ApiConsumes, ApiBearerAuth} from '@nestjs/swagger';





@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('/verify-otp')
  verifyOtp(@Body() verifyOtpDto:VerifyOtpDto ) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post("/sign-up")
  signup(@Body() signupDto:SignupDto) {
    return this.authService.signup(signupDto);
  }
  
  @Post("/login")
  login(@Body() loginDto:LoginDto) {
    return this.authService.login(loginDto);
  }
}
