import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserSocialMedia } from "./user_socialmedia.entity";


@Entity({name: 'follow_unfollw'})
export class FollowUnfollw extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(()=>UserSocialMedia, (user)=>user.followers,{ onDelete:"CASCADE" })
    @JoinColumn({name:'user_id'})
    user_id:UserSocialMedia;
    
   
    @ManyToOne(()=>UserSocialMedia, (user)=>user.following,{ onDelete:"CASCADE" })
    @JoinColumn({name:'following'})
    following: UserSocialMedia;  
   
}
     