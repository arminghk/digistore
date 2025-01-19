import { Module } from '@nestjs/common';
import { CustomConfigModule } from './modules/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoDB.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { BlogModule } from './modules/blog/blog.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CustomConfigModule,
    UserModule,
    AuthModule,
    CategoryModule,
    BlogModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
