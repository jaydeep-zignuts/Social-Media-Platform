import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { FollowUnfollw } from "./followunfollw.entity";
import { LikeDislike } from "./likedislike.entity";
import { UserPost } from "./userpost.entity";

@Entity({name:'users_socialmedia'})
export class UserSocialMedia extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({unique: true})
    user_name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    profile_pic: string;

    @OneToMany(()=>UserPost,(post)=>post.user)
    posts: UserPost[];

    @OneToMany(()=>Comment,(comment)=>comment.user_comment)
    comments: Comment[];

    @OneToMany(()=>LikeDislike,(likes)=>likes.user_like)
    like_user: LikeDislike[];
 
    @OneToMany(()=>FollowUnfollw,(follow)=>follow.user_id)
    @JoinColumn({name:'user_id'})
    followers: FollowUnfollw[];//followers

    @OneToMany(()=>FollowUnfollw,(follow)=>follow.following)
    @JoinTable({name:'following'})
    following: FollowUnfollw[];   
     
   
}
 
   