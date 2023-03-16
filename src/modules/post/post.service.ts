import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { count } from "console";
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

    async createPost(postData:PostDto, file:string, user: UserSocialMedia){
        
        const post = await this.postRepository.save({
            post_name: postData.post_name,
            post_image: file,
            post_caption: postData.post_caption
        });
        user.posts=[post, ...user.posts];
        await user.save();
        return post;
    }
    async getPosts(id:number){
        const post = await this.postRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.user','post_user')
        .where(`post_user.id = ${id}`)
        .getMany();
        const allPost = post.reverse()
        return allPost;
        // .userRepository
        // .find({where:{id:id},relations:['posts']})
    }
    async getPostById(id:number){
        const post = await this.postRepository.findOne({ where:{ id }, relations:['comment']}) 
        return post; 
    }
    async addComment(com: string,post:UserPost, uid:number){
        const user= await this.userRepository.findOne({where:{id:uid}, relations:['comments']});
        const comment = await this.commentRepository.save({
            comment: com
        });
        post.comment = [comment, ...post.comment];
        user.comments=[comment, ...user.comments]
        
        await post.save();
        await user.save();
        return comment;
    }
    async addLike(pid:number,uid:number){
        const user= await this.userRepository.findOne( {where:{ id:uid }, relations:['like_user']});
        const post = await this.postRepository.findOne( {where:{ id:pid }, relations:['like']});
        const like =await this.likedisRepository
        .createQueryBuilder('l')
        .leftJoinAndSelect('l.post_like', 'pl')
        .leftJoinAndSelect('l.user_like', 'ul')
        .where(`ul.id = ${uid} and pl.id = ${pid}`)
        .getCount();

        if(like===1){
            return {
                message: 'Already liked this post'
            }
        }else{  
            const like = await this.likedisRepository.save({});
            post.like = [like, ...post.like];
            user.like_user = [like, ...user.like_user]
    
            await post.save();
            await user.save();
            return like
        }
        

    }
    async removeLike(pid:number, uid:number){
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

            return this.likedisRepository.remove(removeLike);
            
        }else{  
            return {
                message:"already disliked post"
            }
        }

    }
} 