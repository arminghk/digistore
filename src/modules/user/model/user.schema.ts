import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { ProfileDocument } from './profile.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  mobile: string;

  @Prop()
  username: string;

  @Prop()
  firstname: string;
  
  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  new_email: string;
  @Prop()
  new_mobile: string;

  @Prop()
  verify_email: boolean;

  @Prop()
  verify_Mobile: boolean;
  
  @Prop()
  password: string;
  
  @Prop()
  isVerify: boolean 
  
  @Prop({ type: Types.ObjectId, ref: 'ProfileEntity', nullable: true })
  profile: ProfileDocument;

  @Prop({ type: [Types.ObjectId], ref: 'Blog' })
  blogs: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'BlogLike' })
  blog_likes: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'BlogBookmark' })
  blog_bookmarks: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'BlogComment' })
  blog_comments: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Image' })
  images: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Follow' })
  followers: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Follow' })
  following: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
