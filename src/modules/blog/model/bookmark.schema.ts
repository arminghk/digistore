import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BlogBookmarkDocument = HydratedDocument<BlogBookmark>;

@Schema()
export class BlogBookmark {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Blog', required: true })
  blog: string; 

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string; 
}

export const BlogBookmarkSchema = SchemaFactory.createForClass(BlogBookmark);
