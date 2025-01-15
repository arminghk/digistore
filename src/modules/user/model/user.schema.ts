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


  // @Prop({ type: [Types.ObjectId], ref: 'BlogEntity' })
  // blogs: BlogEntity[];

  // @Prop({ type: [Types.ObjectId], ref: 'BlogLikesEntity' })
  // blog_likes: BlogLikesEntity[];


  // @Prop({ type: [Types.ObjectId], ref: 'BlogBookmarkEntity' })
  // blog_bookmarks: BlogBookmarkEntity[];


  // @Prop({ type: [Types.ObjectId], ref: 'BlogCommentEntity' })
  // blog_comments: BlogCommentEntity[];


  // @Prop({ type: [Types.ObjectId], ref: 'ImageEntity' })
  // images: ImageEntity[];


  // @Prop({ type: [Types.ObjectId], ref: 'FollowEntity' })
  // followers: FollowEntity[];

  // @Prop({ type: [Types.ObjectId], ref: 'FollowEntity' })
  // following: FollowEntity[];
}

export const UserSchema = SchemaFactory.createForClass(User);
