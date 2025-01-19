
import { IsNumber, IsNumberString, IsOptional, Length } from "class-validator";

export class CreateCommentDto {
   
    @Length(5)
    text: string;

    blogId: string;

    @IsOptional()
    parentId: string
}