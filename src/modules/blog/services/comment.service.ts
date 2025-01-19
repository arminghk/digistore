import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Blog, BlogSchema } from './../model/blog.schema'
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogComment, BlogCommentSchema } from '../model/comment.schema';
import { BlogService } from './blog.service';
import { BadRequestMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
    constructor(
        @InjectModel(Blog.name) private blogModel:Model<Blog>,
        @InjectModel(BlogComment.name) private blogCommentModel: Model<BlogComment>,
        @Inject(REQUEST) private request: Request,
        @Inject(forwardRef(() => BlogService)) private blogService: BlogService
    ) { }

    async create(commentDto: CreateCommentDto) {
        const { parentId, text, blogId } = commentDto;
        const { id: userId } = this.request.user;
        const blog = await this.blogService.checkExistBlogById(blogId)
        let parent = null;
        if (parentId) {
            parent = await this.blogCommentModel.findById(parentId);
        }
        await this.blogCommentModel.create({
            text,
            accepted: true,
            user: userId,
            blog: blogId,
            parent: parentId ?parentId:null
        });
        return {
            message: PublicMessage.CreatedComment
        }

    }
    async find(paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);
        const commentsQuery = this.blogCommentModel
        .find() 
        .skip(skip)  
        .limit(limit)  
        .sort({ _id: -1 });
        commentsQuery.populate({
            path: 'blog',  
            select: 'title' 
        });
    
        commentsQuery.populate({
            path: 'user',  
            select: 'username', 
            populate: {
                path: 'profile',  
                select: 'nick_name'  
        }
        });
        
        const comments = await commentsQuery.exec();
        const count = await this.blogCommentModel.countDocuments();
    
        return {
            pagination: paginationGenerator(count, page, limit),  
            comments,  
        };
    }
    async findCommentsOfBlog(blogId, paginationDto: PaginationDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);
    
        const [comments, count] = await Promise.all([
          this.blogCommentModel
            .find({ blogId, parentId: null })
            .populate({
              path: 'user',
              select: 'username profile.nick_name',
            })
            .populate({
              path: 'children',
              populate: {
                path: 'user',
                select: 'username profile.nick_name',
              },
            })
            .limit(limit)
            .skip(skip)
            .sort({ _id: -1 }) 
            .lean(),
          this.blogCommentModel.countDocuments({ blogId, parentId: null }),
        ]);
    
        return {
          pagination: paginationGenerator(count, page, limit),
          comments,
        };
      }
    async checkExistById(id: string) {
        const comment = await this.blogCommentModel.findById( id );
        if (!comment) throw new NotFoundException(NotFoundMessage.NotFound);
        return comment;
    }
    async accept(id: string) {
        const comment = await this.checkExistById(id);
        if (comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyAccepted);
        comment.accepted = true;
        await comment.save();
        return {
            message: PublicMessage.Updated
        }
    }
    async reject(id: string) {
        const comment = await this.checkExistById(id);
        if (!comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyRejected);
        comment.accepted = false;
        await comment.save();
        return {
            message: PublicMessage.Updated
        }
    }
}
