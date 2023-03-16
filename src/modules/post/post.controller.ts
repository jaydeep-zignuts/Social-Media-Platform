import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { CommentDto } from "src/dto/comment.dto";
import { PostDto } from "src/dto/post.dto";
import { UserService } from "../users/users.service";
import { PostService } from "./post.service";

@Controller('post')

export class PostController{
    constructor(
        private postService: PostService,
        private jwtService: JwtService,
        private userService: UserService
        ){}

    @Post('createPost')
    @UseInterceptors(FileInterceptor('post_image'))
    async createPost(@Body() postData: PostDto, @UploadedFile() file: Express.Multer.File,  @Req() req:Request){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];       
        const user= await this.userService.findUserById(id);
       
        return await this.postService.createPost(postData, file.filename, user)
    }

    @Get('posts')
    async getPosts(@Req() req:Request){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];       
        const user= await this.userService.findUserById(id);
        return await this.postService.getPosts(user.id);
    }



    @Post('addComment/:pid')
    async addComment(@Body() comment: CommentDto, @Param('pid') id:number,@Req() req:Request){
      
        const post =await this.postService.getPostById(id);
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const uid = jwtData["id"];       
        
        return await this.postService.addComment(comment.comment,post, uid);
    }

    @Post('likePost/:pid')
    async addLike(@Param('pid') id:number, @Req() req:Request){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const uid = jwtData["id"];   

        return await this.postService.addLike(id ,uid);
    }
    @Post('dislikePost/:pid')
    async dislikePost(@Param('pid') id:number, @Req() req:Request ){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const uid = jwtData["id"];

        return await this.postService.removeLike(id,uid);
    }

   
}
   