import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User,UserSchema  } from './model/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { Profile, ProfileSchema } from './model/profile.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Profile.name, schema: ProfileSchema }]), RedisModule],
  controllers: [UserController],
  providers: [UserService,AuthService,JwtService],
  exports: [MongooseModule],

})
export class UserModule {}
