import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
// import { BlogCategoryEntity } from 'src/modules/blog/entities/blog-category.entity'; // وارد کردن مدل BlogCategoryEntity

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  priority: number;


  // @Prop({ type: [Types.ObjectId], ref: 'BlogCategoryEntity' })
  // blog_categories: Types.Array<Types.ObjectId>; // استفاده از ObjectId برای ارجاع به BlogCategoryEntity
}

export const CategorySchema = SchemaFactory.createForClass(Category);
