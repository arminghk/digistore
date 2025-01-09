import { Module } from '@nestjs/common';
import { CustomConfigModule } from './modules/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoDB.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CustomConfigModule,
    UserModule,
    AuthModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
