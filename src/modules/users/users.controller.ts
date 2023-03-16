import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { UserSocialMediaDto } from "src/dto/user_socialmedia.dto";
import { useContainer } from "typeorm";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserService } from "./users.service";
@Controller('user')
export class UserController{
  
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}
    
    @Post('createUser')
    @UseInterceptors(FileInterceptor('profile_pic'))
    async createUser(@Body() user: UserSocialMediaDto, @UploadedFile() file: Express.Multer.File) {
        console.log(file, "it is file");

        return await this.userService.createUser(user, file.filename);
    }


    @Patch('changePassword')
    @UseGuards(JwtAuthGuard)
    async changePassword(@Body('password') password: string,@Req() req:Request ){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];
        
        return await this.userService.changePassword(id,password);
    }

    @Patch('updateProfile')
    @UseInterceptors(FileInterceptor('profile_pic'))
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Body() userData: UserSocialMediaDto, @Req() req:Request,@UploadedFile() file: Express.Multer.File ){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];
    
        return await this.userService.updateProfileData(userData, id, file.filename);
        
    }

    @Get('othersProfile/:uid')
    @UseGuards(JwtAuthGuard)
    async othersProfile(@Param('uid') id: number){
        return await this.userService.otherUserProfile(id);
    }

    @Get('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res() response:Response){
        
        return response.clearCookie('jwt').status(HttpStatus.OK).json({
        message: 'Logged Out'
        });

    }
  
    //user id in param is id of user that i want to follow
    @Post('follow/:uid')
    @UseGuards(JwtAuthGuard)
    async followUser(@Param('uid') uid:number, @Req() req:Request){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];

        return await this.userService.followUser(uid,cid);
    }

    @Get('following')
    @UseGuards(JwtAuthGuard)
    async following(@Req() req:Request){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];

        return await this.userService.following(cid);
    }
    @Get('followers')
    @UseGuards(JwtAuthGuard)
    async followers(@Req() req:Request){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];

        return await this.userService.followers(cid);
    }

    @Post('unfollow/:uid')
    @UseGuards(JwtAuthGuard)
    async unfollow(@Req() req:Request, @Param('uid') uid:number){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];
        //uid is id of user i want to unfollow
        return await this.userService.unfollow(cid,uid);

    }
} 