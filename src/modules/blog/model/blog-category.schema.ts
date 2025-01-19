import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BlogCategoryDocument = HydratedDocument<BlogCategory>;

@Schema()
export class BlogCategory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Blog', required: true })
  blog: string; 

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: string; 
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);
