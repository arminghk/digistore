import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomInt } from 'crypto';
import { User } from '../user/model/user.schema';
import { JwtService } from "@nestjs/jwt";
import { LoginDto, SendOtpDto, SignupDto, VerifyOtpDto } from './dto/otp.dto';
import { ConfigService } from "@nestjs/config";
import { RedisService } from '../redis/redis.service';
import { hashSync, genSaltSync, compareSync } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly redisService: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { mobile } = sendOtpDto;
    const user = await this.userModel.findOne({ mobile });
    if (user) {
      throw new BadRequestException('you are registerd before');
    }
    const code = await this.generateOTP(mobile);
    return {
      message: 'sent code successfully',
      code,
    };
  }
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    let { mobile, code } = verifyOtpDto;

    const storedCode = await this.redisService.get(mobile);

    if (!storedCode) {
      throw new UnauthorizedException('OTP code not found or expired');
    }
    if (storedCode !== code) {
      throw new UnauthorizedException('Invalid OTP code');
    }
    let user = await this.userModel.create({ mobile, isVerify: true });


    const { accessToken, refreshToken } = this.makeTokensForUser({
      id: user._id.toString(),
      mobile: user.mobile,
    });
    return {
      accessToken,
      refreshToken,
      message: "You logged-in successfully",
    };

  }
  async generateOTP(identifier: string) {
    const expiresInSeconds = 120;
    const code = randomInt(10000, 99999).toString();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const key = emailRegex.test(identifier) ? `email:${identifier}` : `mobile:${identifier}`;
    const existingOtp = await this.redisService.get(key);
    if (existingOtp) {
      throw new BadRequestException('OTP not expired');
    }

    await this.redisService.set(key, code, expiresInSeconds);
    return code;
  }
  async signup(signupDto: SignupDto) {
    const { firstname, lastname, email, password, mobile } = signupDto;
    await this.checkEmail(email);
    await this.checkMobile(mobile);
    let hashedPassword = this.hashPassword(password);
    const user = await this.userModel.create({
      firstname,
      lastname,
      mobile,
      email,
      password: hashedPassword,
      isVerify: false,
    });
    return {
      message: "user signup successfully",
      user
    };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new UnauthorizedException("username or password is incorrect");
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException("username or password is incorrect");
    }
    user.isVerify = true;
    await user.save();
    const { accessToken, refreshToken } = this.makeTokensForUser({
      mobile: user.mobile,
      id: user.id,
    });
    return {
      accessToken,
      refreshToken,
      message: "you logged-in successfully",
    };
  }
  async checkEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) throw new ConflictException("email is already exist");
  }
  async checkMobile(mobile: string) {
    const user = await this.userModel.findOne({ mobile });
    if (user) throw new ConflictException("mobile number is already exist");
  }
  hashPassword(password: string) {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  makeTokensForUser(payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.accessTokenSecret"),
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.refreshTokenSecret"),
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get("Jwt.accessTokenSecret"),
      });

      if (typeof payload === "object" && payload?.id) {
        const user = await this.userModel.findOne({ _id: payload.id });
        if (!user) {
          throw new UnauthorizedException("login on your account ");
        }
        return user;
      }
      throw new UnauthorizedException("login on your account ");
    } catch (error) {
      throw new UnauthorizedException("login on your account ");
    }
  }
}
