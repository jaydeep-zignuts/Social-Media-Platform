import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, response, Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UserSocialMediaDto } from "src/dto/user_socialmedia.dto";
import { HttpExceptionFilter } from "src/exception/httpException.filter";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorators";
import { RolesGuard } from "../auth/roles.guards";
import { UserService } from "./users.service";
@Controller('user')
export class UserController{
  
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}
    
    @Post('createUser')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('profile_pic',{
        storage: diskStorage({
            destination: './profile_image',
            filename:(req, file, callback) =>{ 
              console.log(req.file);
              
              const uniqueSuffix=Date.now() + '-' ;
      
              const ext = extname(file.originalname);
              const filename = `${uniqueSuffix}${ext}`;
              console.log(uniqueSuffix, "is file name");
      
              callback(null, filename);
            }
          })
    }))
    async createUser(@Body() user: UserSocialMediaDto, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        console.log(file.filename, "it is file");
        return await this.userService.createUser(user, file.filename,res);
    }


    @Patch('changePassword')
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles('user')
    @UsePipes(ValidationPipe)
    async changePassword(@Body('password') password: string,@Req() req:Request, @Res() res:Response ){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];
         
        return await this.userService.changePassword(id,password, res);
    }

    @Patch('updateProfile')
    @UseInterceptors(FileInterceptor('profile_pic'))
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles('user')
    async updateProfile(@Body() userData: UserSocialMediaDto, @Req() req:Request,@UploadedFile() file: Express.Multer.File,@Res() res:Response ){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];
    
        return await this.userService.updateProfileData(userData, id, file.filename,res);
        
    }

    @Get('othersProfile/:uid')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @UseGuards(RolesGuard)
    @Roles('user')
    async othersProfile(@Param('uid') id: number,@Res() res:Response){
        return await this.userService.otherUserProfile(id, res);
    }

    @Get('logout')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles('user')
    async logout(@Res() response:Response){
        
        return response.clearCookie('jwt').status(HttpStatus.OK).json({
        message: 'Logged Out'
        });

    }
  
    //user id in param is id of user that i want to follow
    @Post('follow/:uid')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles('user')
    async followUser(@Param('uid') uid:number, @Req() req:Request,@Res() res:Response){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];

        return await this.userService.followUser(uid,cid, res);
    }

    @Get('following')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @UseGuards(RolesGuard)
    @Roles('user')
    async following(@Req() req:Request,@Res() res:Response){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];

        return await this.userService.following(cid,res);
    }
    @Get('followers')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @UseGuards(RolesGuard)
    @Roles('user')
    async followers(@Req() req:Request, @Res() res:Response){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];

        return await this.userService.followers(cid, res);
    }

    @Post('unfollow/:uid')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @UseGuards(RolesGuard)
    @Roles('user')
    async unfollow(@Req() req:Request, @Param('uid') uid:number, @Res() res:Response){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        
        //cid is current user id
        const cid = jwtData["id"];
        //uid is id of user i want to unfollow
        return await this.userService.unfollow(cid,uid,res);

    }
} 