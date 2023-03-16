import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserPost } from "./userpost.entity";
import { UserSocialMedia } from "./user_socialmedia.entity";


@Entity({name: 'comments'})
export class Comment extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    comment: string;

    @ManyToOne(()=>UserPost,(post)=>post.comment)
    @JoinColumn({name:'post_id'})
    post_comment: UserPost;
    
    
    @ManyToOne(()=>UserSocialMedia,(user)=>user.comments)
    @JoinColumn({name:'user_id'})
    user_comment: UserSocialMedia;
} 