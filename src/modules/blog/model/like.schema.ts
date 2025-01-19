import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BlogLikeDocument = HydratedDocument<BlogLike>;

@Schema()
export class BlogLike {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Blog', required: true })
  blog: string; 

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string; 
}

export const BlogLikeSchema = SchemaFactory.createForClass(BlogLike);
