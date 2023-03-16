import { IsEmail, IsNotEmpty } from "class-validator";
import { FollowUnfollw } from "src/entities/followunfollw.entity";
import { LikeDislike } from "src/entities/likedislike.entity";
import { UserPost } from "src/entities/userpost.entity";
import { ManyToMany, Unique } from "typeorm";

export class UserSocialMediaDto{

    id: number;
    
    @IsNotEmpty()
    user_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    profile_pic: string;

    posts: number;

    like:number ;
    
    followers: number;

    following: number;
    
}