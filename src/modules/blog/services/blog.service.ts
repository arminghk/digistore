import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Blog, BlogSchema } from '../model/blog.schema';

import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { BlogStatus } from '../enum/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BadRequestMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { isArray } from 'class-validator';
import { CategoryService } from '../../category/category.service';
import { BlogCategory } from '../model/blog-category.schema';
import { BlogLike } from '../model/like.schema';
import { BlogBookmark } from './../model/bookmark.schema';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentService } from './comment.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        @InjectModel(BlogCategory.name) private blogCategoryModel: Model<BlogCategory>,
        @InjectModel(BlogLike.name) private blogLikeModel: Model<BlogLike>,
        @InjectModel(BlogBookmark.name) private blogBookmarkModel: Model<BlogBookmark>,
        @Inject(REQUEST) private request: Request,
        private categoryService: CategoryService,
        private blogCommentService: BlogCommentService,
        // private dataSource: DataSource
    ) { }

    async create(blogDto: CreateBlogDto) {
        const user = this.request.user;
       
        let { title, slug, content, description, image, time_for_study, categories } = blogDto;
   
        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(BadRequestMessage.InvalidCategories)
        }
        
        let slugData = slug ?? title;
        slug = createSlug(slugData);
        
        const categoryIds = [];
        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle);
            if (!category) {
                category = await this.categoryService.insertByTitle(categoryTitle);
            }
            categoryIds.push(category._id);  
        }


        const isExist = await this.checkBlogBySlug(slug);
        if (isExist) {
            slug += `-${randomId()}`
        }
        let blog = await this.blogModel.create({
            title,
            slug,
            description,
            content,
            image,
            status: BlogStatus.Draft,
            time_for_study,
            author: user._id,
            categories: categoryIds
        });
       
        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category) {
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
   
            await this.blogCategoryModel.create({
                blog: blog._id,     
                category: category._id  
            });
        }
        return {
            message: PublicMessage.Created
        }
    }
    async checkBlogBySlug(slug: string) {
        const blog = await this.blogModel.findOne({ slug });
        return blog
    }
    async myBlog() {
        const { id } = this.request.user;
        return this.blogModel.find({
            author: id 
        }).sort({
            _id: -1  
        });
    }
    async blogList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
        const { limit, page, skip } = paginationSolver(paginationDto);

        let { category, search } = filterDto;
  
        let filter: any = {};
    
 
        if (category) {
            filter['categories.title'] = { $regex: category, $options: 'i' }; 
        }
        if (search) {
            search = `%${search}%`;
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
    
        const blogs = await this.blogModel
            .find(filter) 
            .populate('categories', 'title') 
            .populate('author', 'username')
            .populate('author.profile', 'nick_name') 
            .sort({ _id: -1 })
            .skip(skip) 
            .limit(limit);
    
        const count = await this.blogModel.countDocuments(filter); 
    
        return {
            pagination: paginationGenerator(count, page, limit),
            blogs,
        };
    }
    
    async checkExistBlogById(id: string) {
        const blog = await this.blogModel.findById(id);
        if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost);
        return blog
    }
    async delete(id:string) {
        await this.checkExistBlogById(id);
        const result = await this.blogModel.deleteOne({ _id: id });
        return {
            message: PublicMessage.Deleted
        }
    }
    async update(id: string, blogDto: UpdateBlogDto) {
        const user = this.request.user;
        let { title, slug, content, description, image, time_for_study, categories } = blogDto;
        const blog = await this.checkExistBlogById(id)
        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(BadRequestMessage.InvalidCategories)
        }
        let slugData = null;
        if (title) {
            slugData = title;
            blog.title = title;
        }
        if (slug) slugData = slug;

        if (slugData) {
            slug = createSlug(slugData);
            const isExist = await this.checkBlogBySlug(slug);
            if (isExist && isExist.id !== id) {
                slug += `-${randomId()}`
            }
            blog.slug = slug;
        }
        if (description) blog.description = description;
        if (content) blog.content = content;
        if (image) blog.image = image;
        if (time_for_study) blog.time_for_study = time_for_study;
        await blog.save();
        if (categories && isArray(categories) && categories.length > 0) {
            await this.blogCategoryModel.deleteOne({ blogId: blog.id });
        }
        // for (const categoryTitle of categories) {
        //     let category = await this.categoryService.findOneByTitle(categoryTitle)
        //     if (!category) {
        //         category = await this.categoryService.insertByTitle(categoryTitle)
        //     }
        //     await this.blogCategoryModel.create({
        //         blogId: blog.id,
        //         categoryId: category.id
        //     });
        // }
        return {
            message: PublicMessage.Updated
        }
    }
    async likeToggle(blogId: string) {
        const { _id: userId } = this.request.user;        console.log('userId---',userId);
        const blog = await this.checkExistBlogById(blogId);
        const isLiked = await this.blogLikeModel.findOne({ user: userId, blog: blogId });

        let message = PublicMessage.Like;
        if (isLiked) {
            await this.blogLikeModel.deleteOne({ _id: isLiked.id });
            message = PublicMessage.DisLike
        } else {
            await this.blogLikeModel.create({
                user: userId,
                blog: blogId,
            });
        }
        return { message }
    }
    async bookmarkToggle(blogId: string) {
        const { id: userId } = this.request.user;
        const blog = await this.checkExistBlogById(blogId);
        const isBookmarked = await this.blogBookmarkModel.findOne({ 
            user: userId,
            blog: blogId,
        });
        let message = PublicMessage.Bookmark;
        if (isBookmarked) {
            await this.blogBookmarkModel.deleteOne({ _id: isBookmarked.id });
            message = PublicMessage.UnBookmark
        } else {
            await this.blogBookmarkModel.create({
                user: userId,
                blog: blogId,
            })
        }
        return { message }
    }
    async findOneBySlug(slug: string, paginationDto: PaginationDto, userId?: string) {
  
        const blog = await this.blogModel
          .findOne({ slug })
          .populate({
            path: 'categories',
            populate: { path: 'category', select: 'title' },
          })
          .populate({
            path: 'author',
            populate: { path: 'profile', select: 'nick_name' },
            select: 'username',
          })
          .lean();
    
        if (!blog) throw new NotFoundException('Blog not found');

        const commentsData = await this.blogCommentService.findCommentsOfBlog(blog._id, paginationDto);

        let isLiked = false;
        let isBookmarked = false;
        if (userId) {
          isLiked = !!(await this.blogLikeModel.findOne({ userId, blogId: blog._id }));
          isBookmarked = !!(await this.blogBookmarkModel.findOne({ userId, blogId: blog._id }));
        }

        const suggestBlogs = await this.blogModel
          .aggregate([
            {
              $sample: { size: 3 },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'authorInfo',
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'categories',
                foreignField: '_id',
                as: 'categoriesInfo',
              },
            },
            {
              $project: {
                slug: 1,
                title: 1,
                description: 1,
                time_for_study: 1,
                image: 1,
                'authorInfo.username': 1,
                'authorInfo.profile.nick_name': 1,
                categories: '$categoriesInfo.title',
                likes: {
                  $size: { $ifNull: ['$likes', []] },
                },
                bookmarks: {
                  $size: { $ifNull: ['$bookmarks', []] },
                },
                comments: {
                  $size: { $ifNull: ['$comments', []] },
                },
              },
            },
          ])
          .exec();
    
        return {
          blog,
          isLiked,
          isBookmarked,
          commentsData,
          suggestBlogs,
        };
      }

}
