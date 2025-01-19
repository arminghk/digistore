import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BlogCommentDocument = HydratedDocument<BlogComment>;

@Schema({ timestamps: true }) 
export class BlogComment {
  @Prop({ required: true })
  text: string;

  @Prop({ default: true })
  accepted: boolean; 

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Blog', required: true })
  blog: string; 

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'BlogComment', default: null })
  parent: string | null;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'BlogComment' }])
  children: string[]; 
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
