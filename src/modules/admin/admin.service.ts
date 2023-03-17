import { HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSocialMedia } from "src/entities/user_socialmedia.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { AdminDto } from "src/dto/admin.dto";
import { take } from "rxjs";
import { UserPost } from "src/entities/userpost.entity";
import { Response } from "express";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(UserSocialMedia) private userRepository: Repository<UserSocialMedia>,
        @InjectRepository(UserPost) private postRepository:Repository<UserPost>

    ){}

    async getAllUser(res: Response, page: number, take: number, user_name: string) {
        if (user_name) {
            try {

                const getUsers = await this.userRepository.find({ where: { user_name: user_name }, relations: ['posts', 'posts.like', 'followers', 'followers', 'following'] });
                return res.status(HttpStatus.OK).json({
                    status: 200,
                    message: getUsers
                });
            } catch (e) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 500,
                    data: e.message
                })
            }

        }else{
            try {
                take = take || 3;
                page = page || 1;
                const skip = (page - 1) * take;
                const getUsers = await this.userRepository.find({
                    relations: ['posts', 'posts.like', 'followers', 'followers', 'following'],
                    take: take,
                    skip: skip
                },
                );
                const allUser= await this.userRepository.find({});
                const totalUser=allUser.length
                
                return res.status(HttpStatus.OK).json({
                    status: 200,
                    message: getUsers,
                    totalUser: totalUser
                });
            } catch (e) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 500,
                    message: e.message
                });
            }
        }
        
    }

    async activeInactive(id,res:Response){
        try{
            const getUser= await this.userRepository.findOne({where:{id}});
            if(getUser.isActive){
                const inactive= await this.userRepository.update({id:id},{isActive:false});
                return res.status(HttpStatus.OK).json({
                    status:200,
                    data: inactive
                });;
            }else{
                const active= await this.userRepository.update({id:id},{isActive:true});
                return res.status(HttpStatus.OK).json({
                    status:200,
                    data: active
                });
            }
        }catch(e){
            return res.status(500).json({
                status: 500,
                message: e.message,
            })
        }
    }
    async getPostByUser(id:number ,res:Response){
        try{
            
            
            const getPostByUser = await this
                .postRepository
                .findAndCount({
                    relations: ['user','like','like.user_like','comment','comment.user_comment'], order: { id: 'desc' }, where: { user: { id: id } },
                    
                });
    
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: getPostByUser
            })
        }catch(e){
            return e.status(500).json({
                status: e.code,
                message: e.message
            });
        }
    }
// const getPostByUser = await this.
        //     userRepository.
        //     findAndCount({
        //         where: { id }, relations: ['posts', 'posts.like', 'posts.comment'],
        //         order: { posts: { id: 'desc' }, 
                
        //        },
        //      take:take,
        //      skip: skip

        //     }, );
    
}