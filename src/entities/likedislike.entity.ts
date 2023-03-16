import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserPost } from "./userpost.entity";
import { UserSocialMedia } from "./user_socialmedia.entity";


@Entity({name: 'like_dislike'})
export class LikeDislike extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    
    // @Column()
    // like: number;

    @ManyToOne(()=>UserPost, (posts)=>posts.like)
    @JoinColumn({name:'post_id'})
    post_like: UserPost;

    @ManyToOne(()=>UserSocialMedia,(user)=>user.like_user, { onDelete:"CASCADE" })   
    @JoinColumn({name:'user_id'})
    user_like: UserSocialMedia;

}