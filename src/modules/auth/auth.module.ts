import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    UserModule,  
    RedisModule,
    MongooseModule,
    JwtModule.register({
      secret: 'your-secret-key', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtService],
  exports:[AuthService]
 
})
export class AuthModule {}
