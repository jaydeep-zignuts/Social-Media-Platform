import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { count } from "console";
import { Response } from "express";
import { CommentDto } from "src/dto/comment.dto";
import { PostDto } from "src/dto/post.dto";
import { Comment } from "src/entities/comment.entity";
import { LikeDislike } from "src/entities/likedislike.entity";
import { UserPost } from "src/entities/userpost.entity";
import { UserSocialMedia } from "src/entities/user_socialmedia.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostService{
    constructor(
        @InjectRepository(UserPost) private postRepository: Repository<UserPost>,
        @InjectRepository(UserSocialMedia) private userRepository: Repository<UserSocialMedia>,
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(LikeDislike) private likedisRepository: Repository<LikeDislike>

    ){}

    async createPost(postData:PostDto, file:string, user: UserSocialMedia, res:Response){
        try{

            const post = await this.postRepository.save({
                post_name: postData.post_name,
                post_image: file,
                post_caption: postData.post_caption
            });
            user.posts=[post, ...user.posts];
            await user.save();
            return res.status(HttpStatus.OK).json({
                status:200,
                data: post
            });
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statsu:500,
                message: e.message
            });
        }
    }
    async getPosts(id:number,page:number, take:number,res:Response){
       try{

           take = take ;
           page = page;
           const skip = (page - 1) * take;
   
           const getPostByUser = await this
           .postRepository
           .findAndCount({
               relations: ['user','like','like.user_like','comment','comment.user_comment'], order: { id: 'desc' }, where: { user: { id: id } },
               take: take,
               skip: skip,
   
           })
           return res.status(HttpStatus.OK).json({
                status:200,
                data: getPostByUser
           });
       }catch(e){
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statsu:500,
            message: e.message
        });
       }
        
    }
    async getPostById(id:number){
        const post = await this.postRepository.findOne({ where:{ id }, relations:['comment']}) 
        return post; 
    }

    async addComment(com: string,post:UserPost, uid:number,res:Response){
        try{

            const user= await this.userRepository.findOne({where:{id:uid}, relations:['comments']});
            const comment = await this.commentRepository.save({
                comment: com
            });
            post.comment = [comment, ...post.comment];
            user.comments=[comment, ...user.comments]
            
            await post.save();
            await user.save();
            return res.status(HttpStatus.OK).json({
                status:200,
                data: comment
            });
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statsu:500,
                message: e.message
            });
        }
    }
    async addLike(pid:number,uid:number,res:Response){
        try{
const user= await this.userRepository.findOne( {where:{ id:uid }, relations:['like_user']});
        const post = await this.postRepository.findOne( {where:{ id:pid }, relations:['like']});
        const like =await this.likedisRepository
        .createQueryBuilder('l')
        .leftJoinAndSelect('l.post_like', 'pl')
        .leftJoinAndSelect('l.user_like', 'ul')
        .where(`ul.id = ${uid} and pl.id = ${pid}`)
        .getCount();
console.log(like);

        if(like===1){
            return res.status(HttpStatus.OK).json({
                message: 'You already liked this post'
                
            })
        }else{  
            const like = await this.likedisRepository.save({});
            post.like = [like, ...post.like];
            user.like_user = [like, ...user.like_user]
    
            await post.save();
            await user.save();
            return res.status(HttpStatus.OK).json({
                status:200,
                data: like
            });
        }
        }catch(e){
            return res.status(500).json({
                status:500,
                message: e
            });
        }
        
        

    }
    async removeLike(pid:number, uid:number,res:Response){
        try{

            const user= await this.userRepository.findOne( {where:{ id:uid }, relations:['like_user']});
            const post = await this.postRepository.findOne( {where:{ id:pid }, relations:['like']});
            const like =await this.likedisRepository
            .createQueryBuilder('l')
            .leftJoinAndSelect('l.post_like', 'pl')
            .leftJoinAndSelect('l.user_like', 'ul')
            .where(`ul.id = ${uid} and pl.id = ${pid}`)
            .getCount();
            if(like===1){
                // const delObj =await this.transactionRepository
                // .createQueryBuilder('t').leftJoinAndSelect('t.tr_accounts','tracc')
                // .where(`tracc.id=${id}`).getMany();
                const removeLike = await this.likedisRepository.createQueryBuilder('dis')
                .leftJoinAndSelect('dis.post_like', 'pl')
                .leftJoinAndSelect('dis.user_like', 'ul')
                .where(`ul.id = ${uid} and pl.id = ${pid}`)
                .getOne();
    
                const unlike = await this.likedisRepository.remove(removeLike);
                return res.status(HttpStatus.OK).json({
                    status:200,
                    data: unlike
                });
                
            }else{  
                return res.status(HttpStatus.OK).json({
                    status:200,
                    message: "Already disliked post"
                })
            }
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statsu:500,
                message: e.message
            }); 
        }

    }
}  