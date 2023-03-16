import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany,  PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { LikeDislike } from "./likedislike.entity";
import { UserSocialMedia } from "./user_socialmedia.entity";

@Entity({name:'user_post'})
export class UserPost extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    post_name: string;

    @Column()
    post_image: string;

    @Column() 
    post_caption: string;
 
    @ManyToOne(()=>UserSocialMedia,(users)=>users.posts)
    @JoinColumn({name: 'user_id'})
    user: UserSocialMedia;

    @OneToMany(()=>Comment, (comments)=>comments.post_comment)
    comment: Comment[]
   
    @OneToMany(()=>LikeDislike,(likes)=>likes.post_like)
    like: LikeDislike[]


} 