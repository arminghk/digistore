import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema'; // فرض می‌کنیم مدل User در این مسیر قرار دارد

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
    @Prop()
    nick_name: string;

    @Prop({ nullable: true })
    bio: string;

    @Prop({ nullable: true })
    image_profile: string;

    @Prop({ nullable: true })
    bg_image: string;

    @Prop({ nullable: true })
    gender: string;

    @Prop({ nullable: true })
    birthday: Date;

    @Prop({ nullable: true })
    x_profile: string;

    @Prop({ nullable: true })
    linkedin_profile: string;

    @Prop({ type: Types.ObjectId, ref: 'User' ,required:true })
    user: User;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);