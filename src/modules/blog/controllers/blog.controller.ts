import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto, } from '../dto/blog.dto';

// import { AuthGuard } from '../../auth/guards/auth.guard';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('blog')
@AuthDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post("/")
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto)
  }
  @Get("/my-blog")
  myBlogs() {
    return this.blogService.myBlog()
  }
  @Get("/")
  @SkipAuth()
  find(@Query() paginationDto: PaginationDto, @Query() filterDto: FilterBlogDto) {
    return this.blogService.blogList(paginationDto, filterDto)
  }
  @Get("/by-slug/:slug")
  @SkipAuth()
  findOneBySlug(@Param('slug') slug: string, @Query() paginationDto: PaginationDto) {
    return this.blogService.findOneBySlug(slug, paginationDto)
  }
  @Get("/like/:id")
  likeToggle(@Param("id") id: string) {
    return this.blogService.likeToggle(id)
  }
  @Get("/bookmark/:id")
  bookmarkToggle(@Param("id") id: string) {
    return this.blogService.bookmarkToggle(id)
  }
  @Delete("/:id")
  delete(@Param("id") id: string) {
    return this.blogService.delete(id);
  }
  @Put("/:id")
  update(@Param("id") id: string, @Body() blogDto: UpdateBlogDto) {
    return this.blogService.update(id, blogDto)
  }
}
