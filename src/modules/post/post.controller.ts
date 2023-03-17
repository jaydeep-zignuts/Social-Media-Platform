import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request,Response } from "express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { CommentDto } from "src/dto/comment.dto";
import { PostDto } from "src/dto/post.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorators";
import { RolesGuard } from "../auth/roles.guards";
import { UserService } from "../users/users.service";
import { PostService } from "./post.service";


@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController{
    constructor(
        private postService: PostService,
        private jwtService: JwtService,
        private userService: UserService
        ){}

    //create new post
    @Post('createPost')
    @UsePipes(ValidationPipe)
    // @UseGuards(RolesGuard)
    @Roles('user')
    @UseInterceptors(FileInterceptor('post_image',{
        storage: diskStorage({
            destination: './post_image',
            filename:(req, file, callback) =>{ 
              console.log(req.file);
              
              const uniqueSuffix=Date.now() + '-';
      
              const ext = extname(file.originalname);
              const filename = `${uniqueSuffix}${ext}`;
              console.log(uniqueSuffix, "is file name");
      
              callback(null, filename);
            }
          })
    })) 
    async createPost(@Body() postData: PostDto, @UploadedFile() file: Express.Multer.File,  @Req() req:Request, @Res() res: Response){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];       
        const user= await this.userService.findUserById(id);
        console.log(file);
        return await this.postService.createPost(postData, file.filename, user,res)
    }
 
    //get post of current user
    @Get('posts')
    // @UseGuards(RolesGuard)
    @Roles('user')
    async getPosts(@Req() req:Request,@Query() { page, take }, @Res() res: Response ){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const id = jwtData["id"];       
        const user= await this.userService.findUserById(id);
        return await this.postService.getPosts(user.id,page,take,res);
    }

    //add comment on post and pid is post id on which we need to add comment
    @Post('addComment/:pid')
    // @UseGuards(RolesGuard)
    @Roles('user')
    async addComment(@Body() comment: CommentDto, @Param('pid') id:number,@Req() req:Request, @Res() res: Response){
      
        const post =await this.postService.getPostById(id);
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const uid = jwtData["id"];       
        
        return await this.postService.addComment(comment.comment,post, uid, res);
    }

    //like post and pid is post id on which we want to like
    @Post('likePost/:pid')
    // @UseGuards(RolesGuard)
    @Roles('user')
    async addLike(@Param('pid') id:number, @Req() req:Request, @Res() res: Response){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const uid = jwtData["id"];   

        return await this.postService.addLike(id ,uid, res);
    }

    //dislike post and pid is post id on which we want to dislike
    @Post('dislikePost/:pid')
    // @UseGuards(RolesGuard)
    @Roles('user')
    async dislikePost(@Param('pid') id:number, @Req() req:Request, @Res() res: Response ){
        const token = req.cookies['jwt'];
        const jwtData = await this.jwtService.verify(token);
        const uid = jwtData["id"];

        return await this.postService.removeLike(id,uid, res);
    }

   
}
   