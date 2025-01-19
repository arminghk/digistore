
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, Length } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';


export class CreateBlogDto {

    @IsNotEmpty()
    @Length(0,150)
    title: string

    slug: string
    
    @IsNotEmpty()
    @IsNumberString()
    time_for_study: string

    image: string

    @IsNotEmpty()
    @Length(0, 300)
    description: string

    @IsNotEmpty()
    @Length(0,100)
    content: string

    categories: string[] | string
}
export class UpdateBlogDto extends PartialType(CreateBlogDto){}

export class FilterBlogDto {
    category: string;
    search: string;
}