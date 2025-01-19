import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({ nullable: true })
  image: string;

  @Prop({ unique: true, required: true })
  slug: string;

  @Prop()
  time_for_study: string;

  @Prop({ default: 'Draft' }) 
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: string; 

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'BlogLike' }])
  likes: string[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'BlogCategory' }])
  categories: string[]; 

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'BlogBookmark' }])
  bookmarks: string[]; 

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'BlogComment' }])
  comments: string[]; 
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
