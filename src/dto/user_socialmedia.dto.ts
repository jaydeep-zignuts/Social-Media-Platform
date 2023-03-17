import { IsEmail, isNotEmpty, IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { FollowUnfollw } from "src/entities/followunfollw.entity";
import { LikeDislike } from "src/entities/likedislike.entity";
import { UserPost } from "src/entities/userpost.entity";
import { Column, ManyToMany, Unique } from "typeorm";

export class UserSocialMediaDto{

    id: number;
    
    @IsNotEmpty()
    user_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    profile_pic: string;

    isActive: boolean;

    posts: number;

    like:number ;
    
    followers: number;

    following: number;
    
}

