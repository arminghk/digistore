import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './model/category.schema'; 
import { ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>, 
  ) { }


  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto;
    title = await this.checkExistAndResolveTitle(title);
    const category = new this.categoryModel({
      title,
      priority,
    });
    await category.save(); 
    return {
      message: PublicMessage.Created
    };
  }


  async insertByTitle(title: string) {
    const category = new this.categoryModel({ title });
    await category.save();
    return category; 
  }


  async checkExistAndResolveTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryModel.findOne({ title }); 
    if (category) throw new ConflictException(ConflictMessage.CategoryTitle);
    return title;
  }


  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const categories = await this.categoryModel
      .find()            
      .skip(skip)        
      .limit(limit)     
      .exec();
  
    const count = await this.categoryModel.countDocuments();
  
    return {
      pagination: paginationGenerator(count, page, limit), 
      categories
    };
  }
  


  async findOne(id: string) {
    const category = await this.categoryModel.findById(id); 
    if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory);
    return category;
  }


  async findOneByTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    return await this.categoryModel.findOne({ title }); 
  }

 
  async update(id: string, updateCategoryDto) {
    const category = await this.findOne(id); 
    const { priority, title } = updateCategoryDto;
    if (title) category.title = title;
    if (priority) category.priority = priority;
    await category.save(); 
    return {
      message: PublicMessage.Updated
    };
  }

  
  async remove(id: string) {
    await this.findOne(id); 
    await this.categoryModel.findByIdAndDelete(id); 
    return {
      message: PublicMessage.Deleted
    };
  }
}
