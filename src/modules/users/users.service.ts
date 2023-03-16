import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSocialMediaDto } from "src/dto/user_socialmedia.dto";
import { UserSocialMedia } from "src/entities/user_socialmedia.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { ExpressAdapter } from "@nestjs/platform-express";
import { IsEmail } from "class-validator";
import { FollowUnfollw } from "src/entities/followunfollw.entity";

@Injectable()
export class UserService{

    constructor(
        @InjectRepository(UserSocialMedia) private userRepository : Repository<UserSocialMedia>,
        @InjectRepository(FollowUnfollw) private followUnfollowRepository : Repository<FollowUnfollw>,
    ){}

    async createUser(user: UserSocialMediaDto, file : string){
        // console.log("file",file.filename);
        
        const salt = await bcrypt.genSalt();
        const password= await bcrypt.hash(user.password,salt);
        const userDate = new UserSocialMedia();
        userDate.user_name= user.user_name;
        userDate.email = user.email;
        userDate.password = password;
        userDate.profile_pic = file;

        return await this.userRepository.save(userDate);
    }

    async findUserByEmail(email:string){
        const user = await this.userRepository.findOne({where:{email:email}})
        return user;
    }
    
    async findUserById(id:number){
        const user = await this.userRepository.findOne({where:{id:id}, relations:['comments','posts']})
        return user;
    }
    async changePassword(id:number,password:string){
        console.log("change Password");
        
        const userData = await this.userRepository.findOne({where: {id }});
        if(!userData) throw new BadRequestException();
        
        const salt = await bcrypt.genSalt();
        const newPassword = await bcrypt.hash(password,salt);

        const pass = await this.userRepository.update({id: id }, { password: newPassword});
        return pass;
    }
    async updateProfileData(userData: UserSocialMediaDto, id:number,file:string){
        const pass = await this.userRepository.update( 
            {id: id },
            { 
                user_name : userData.user_name,
                email: userData.email,
                profile_pic: file

            }
        );
        return pass;
    }

    async otherUserProfile(id:number){
        console.log();
        
        const otherUser = await this.userRepository.findOne({where:{id:id}, relations:['posts','posts.comment','posts.like']});
        return otherUser;
    }

    async followUser(id:number, cid: number){
        
        const follow =await this.followUnfollowRepository.save({
        });

        const currentUser = await this.userRepository.findOne({where:{id:cid},relations:['followers']});
       
        const user = await this.userRepository.findOne({where:{id:id},relations:['following']});
        
        
        user.following=[follow, ...user.following];
        currentUser.followers=[follow, ...currentUser.followers];
        await user.save(); 
        await currentUser.save(); 

        const followers=await this.followUnfollowRepository.find({where:{id:follow.id}, relations:['following']});
        return followers;
    } 

    async following(id:number){
        const getFollowing=await this.userRepository.find({ where:{id:id}, relations:['followers','followers.following']});
        // const getFollowing = await this.followUnfollowRepository.find({relations:['user_id','user_id.followers']});
        return getFollowing;
    }
    async followers(id:number){
        const getFollowers=await this.userRepository.find({ where:{id:id}, relations:['following','following.user_id']});
        return getFollowers;
    }

    async unfollow(id:number, uid: number){
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
        
        console.log("+++++++++++++++++++++++++++++++++++");
        console.log(getFollower);
        console.log(getFollower1);
        

        if(getFollower1===1){
            // const unfollow = await this.userRepository
            // .createQueryBuilder('u')
            // .leftJoinAndSelect('u.following','uf')
            // .where(`uf.user_id = ${id} and uf.following=${uid}`)
            // .getOne();

            const unfollow =await this
            .followUnfollowRepository
            .createQueryBuilder('fu')
            .leftJoinAndSelect('fu.following','fl')
            .where(`fl.id=${uid}`) 
            .getOne();
            console.log("unfollow",unfollow);
            

            return await this.followUnfollowRepository.remove(unfollow);

        } 
        else{
            return{
                message: 'already unfollowed'
            }
        }

        // console.log("Count is :: ",getFollower);
        
        
    }
}       