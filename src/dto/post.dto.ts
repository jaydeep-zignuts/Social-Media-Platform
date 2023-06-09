import { IsEmail, IsNotEmpty } from "class-validator";
import { LikeDislike } from "src/entities/likedislike.entity";
import { UserSocialMedia } from "src/entities/user_socialmedia.entity";
import { Unique } from "typeorm";

export class PostDto{

    id:number;

    @IsNotEmpty()
    post_name: string;

    post_image: string;
    
    @IsNotEmpty()
    post_caption: string;

    user: number;

    comment: string;

    like: number;
}