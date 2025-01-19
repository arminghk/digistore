import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { AuthGuard } from '../../auth/guards/AuthGuard';
import { BlogCommentService } from './../services/comment.service';
import { CreateCommentDto } from '../dto/comment.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('blog-comment')
@UseGuards(AuthGuard)
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) { }

  @Post("/")
  create(@Body() commentDto: CreateCommentDto) {
    return this.blogCommentService.create(commentDto);
  }
  @Get("/")
  find(@Query() paginationDto: PaginationDto) {
    return this.blogCommentService.find(paginationDto)
  }
  @Put("/accept/:id")
  accept(@Param("id") id: string) {
    return this.blogCommentService.accept(id)
  }
  @Put("/reject/:id")
  reject(@Param("id") id: string) {
    return this.blogCommentService.reject(id)
  }
}
