import { IsString,Length ,IsEmail} from 'class-validator';
import { IsValidIranianPhoneNumber } from 'src/validators/phoneNumber.validator';
import {ConfirmedPassword} from "src/common/decorators/password.decorator";
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty()
  @IsString()
  @IsValidIranianPhoneNumber({ message: 'Phone number must be a valid Iranian number starting with 09 and followed by 9 digits' })
  mobile: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsValidIranianPhoneNumber({ message: 'Phone number must be a valid Iranian number starting with 09 and followed by 9 digits' })
  mobile: string;
  
  @ApiProperty()
  @IsString()
  @Length(5, 5, {message: "incorrect code"})
  code: string;
}

export class SignupDto {
  @ApiProperty()
  @IsString()
  firstname: string;
  @ApiProperty()
  @IsString()
  lastname: string;
  @ApiProperty()
  @IsValidIranianPhoneNumber({ message: 'Phone number must be a valid Iranian number starting with 09 and followed by 9 digits' })
  mobile: string;
  @ApiProperty()
  @IsString()
  @IsEmail({}, {message: "your email format is incorrect"})
  email: string;
  @ApiProperty()
  @IsString()
  @Length(6, 20, {message: "your password is incorrect"})
  password: string;
  @ApiProperty()
  @IsString()
  @ConfirmedPassword("password")
  confirm_password: string;
}
export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsEmail({}, {message: "your email format is incorrect"})
  email: string;
  @ApiProperty()
  @IsString()
  @Length(6, 20, {message: "your password is incorrect"})
  password: string;
}
