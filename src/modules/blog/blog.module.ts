import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { BlogSchema } from './model/blog.schema';
import { CategoryService } from '../category/category.service';
import { CategorySchema } from '../category/model/category.schema';
import { BlogCategorySchema } from './model/blog-category.schema';
import { BlogLikeSchema } from './model/like.schema';
import { BlogBookmarkSchema } from './model/bookmark.schema';
import { BlogCommentService } from './services/comment.service';
import { BlogCommentSchema } from './model/comment.schema';
import { BlogCommentController } from './controllers/comment.controller';
import { AddUserToReqWOV } from 'src/common/middleware/addUserToReqWOV.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'BlogCategory', schema: BlogCategorySchema },
      { name: 'BlogLike', schema: BlogLikeSchema },
      { name: 'BlogBookmark', schema: BlogBookmarkSchema },
      { name: 'BlogComment', schema: BlogCommentSchema },
    ]),
    AuthModule
  ],
  controllers: [
    BlogController,
     BlogCommentController
    ],
  providers: [BlogService, CategoryService, 
    BlogCommentService
  ],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddUserToReqWOV).forRoutes('blog/by-slug/:slug');
  }
}
