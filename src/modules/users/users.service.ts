import { BadRequestException, HttpException, HttpStatus, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSocialMediaDto } from "src/dto/user_socialmedia.dto";
import { UserSocialMedia } from "src/entities/user_socialmedia.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { ExpressAdapter } from "@nestjs/platform-express";
import { IsEmail } from "class-validator";
import { FollowUnfollw } from "src/entities/followunfollw.entity";
import { ErrorHttpStatusCode } from "@nestjs/common/utils/http-error-by-code.util";
import { ErrorCode } from "multer";
import { Response, response } from "express";
import { HttpExceptionFilter } from "src/exception/httpException.filter";
import { UpdateUserSocialMedia } from "src/dto/updateUserDto.dto";

@Injectable()
export class UserService{

    constructor(
        @InjectRepository(UserSocialMedia) private userRepository : Repository<UserSocialMedia>,
        @InjectRepository(FollowUnfollw) private followUnfollowRepository : Repository<FollowUnfollw>,
    ){}

    async createUser(user: UserSocialMediaDto, file: string, res:Response){
        try{

            const salt = await bcrypt.genSalt();
            const password= await bcrypt.hash(user.password,salt);
            const userDate = new UserSocialMedia();
            userDate.user_name= user.user_name;
            userDate.email = user.email;
            userDate.password = password;
            userDate.profile_pic = file;   
            const newUser = await this.userRepository.save(userDate);
            return res.status(201).json({
                status:201,
                message:'user created successfully',
                data: newUser
            });

        }catch(e){ 
            return res.status(500).json({
                status:500,
                message: e.message,
            })
        }
    }

    async getUserById(id:number){
            const admin=await this.userRepository.findOne({where:{id}});
            return admin;
    }
    async findUserByEmail(email:string){
            const user = await this.userRepository.findOne({where:{email:email}})
            return user;
    }
    async findUserById(id:number){
        const user = await this.userRepository.findOne({where:{id:id}, relations:['comments','posts']})
        return user;
    }
    async changePassword(id:number,password:string,res:Response){
        try{
            const userData = await this.userRepository.findOne({where: {id }});
            if(!userData) throw new BadRequestException();
            
            const salt = await bcrypt.genSalt();
            const newPassword = await bcrypt.hash(password,salt);
    
            const pass = await this.userRepository.update({id: id }, { password: newPassword});
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: pass
            });
        }catch(e){
            return res.status(500).json({
                status:500,
                message: e.message
            })
        }
    }
    async updateProfileData(userData: UpdateUserSocialMedia, id:number,file:string, res: Response){
       try{
        const pass = await this.userRepository.update( 
            {id: id },
            { 
                user_name : userData.user_name,
                email: userData.email,
                profile_pic: file

            }
        );
        return res.status(500).json({
            status: 500,
            data: pass
        });
       }catch(e){
        return res.status(500).json({
            status: 500,
            mesage: e.mesage
        })
       }
    }

    async otherUserProfile(id:number,res:Response){
        try{

            const otherUser = await this.userRepository.findOne({where:{id:id}, relations:['posts','posts.comment','posts.like']});
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: otherUser
            });
        }catch(e){
            return res.status(500).json({
                status: 500,
                message: e.mesage
            });
        }      
    }

    async followUser(id: number, cid: number, res: Response) {
        try {
            const getFollowing = await this.userRepository
                .createQueryBuilder('u')
                .leftJoinAndSelect('u.following', 'fl')
                .where(`fl.following=${id}`)
                .getCount();

            console.log(getFollowing);
            if (getFollowing === 1) {
                return {
                    message: 'You already followed this user'
                }
            } else {

                const follow = await this.followUnfollowRepository.save({
                });

                const currentUser = await this.userRepository.findOne({ where: { id: cid }, relations: ['followers','following'] });

                const user = await this.userRepository.findOne({ where: { id: id }, relations: ['following','followers'] });


                // user.following = [follow, ...user.following];

                // currentUser.followers = [follow, ...currentUser.followers];
 
                 user.followers = [follow, ...user.followers];

                currentUser.following = [follow, ...currentUser.following];
 
                await user.save();
                await currentUser.save();

                const followers = await this.followUnfollowRepository.find({ where: { id: follow.id }, relations: ['following'] });
                return res.status(HttpStatus.OK).json({
                    status: 200,
                    data: followers
                });
            }
        }catch (e) {
            console.log(e);
            
            return res.status(500).json({
                status: 500,
                message: e.message
            });
        }
    } 

    async following(id:number,res:Response){
        try{
            const getFollowing=await this.userRepository.find({ where:{id:id}, relations:['following','following.user_id']});
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: getFollowing
            });
        }catch(e){
            return res.status(500).json({
                status: 500,
                message: e.message
                
            });
        }
        
    }
    async followers(id:number, res:Response){
        try{

            const getFollowers=await this.userRepository.find({ where:{id:id}, relations:['followers','followers.following']});
            return res.status(HttpStatus.OK).json({
                status:200,
                data: getFollowers
            });
        }catch(e){
            return res.status(500).json({
                status: 500,
                message: e.message
            });
        }
    }

    async unfollow(id:number, uid: number, res:Response){
        try{
            const getFollower= await this
            .userRepository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.following','uf') 
            .where(`uf.user_id = ${id} and uf.following=${uid}`)
            .getCount();
    
            const getFollower1= await this
            .followUnfollowRepository
            .createQueryBuilder('fu')
            .leftJoinAndSelect('fu.user_id','f_u')
            .where(`f_u.id=${id}`)
            .getCount(); 

            if(getFollower1===1){
                const unfollow =await this
                .followUnfollowRepository
                .createQueryBuilder('fu')
                .leftJoinAndSelect('fu.following','fl')
                .where(`fl.id=${uid}`) 
                .getOne();
                console.log("unfollow",unfollow);
                
               const unfollowedUser =  await this.followUnfollowRepository.remove(unfollow);
               return res.status(HttpStatus.OK).json({
                    status:200,
                    data: unfollowedUser
               })
            } 
            else{
                return{
                    message: 'already unfollowed'
                }
            }        
        }catch(e){
            return res.status(500).json({
                status: 500,
                message: e.mesage
            });
        }
    }
}       