import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { LikeDislike } from 'src/entities/likedislike.entity';
import { UserPost } from 'src/entities/userpost.entity';
import { UserSocialMedia } from 'src/entities/user_socialmedia.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        UserSocialMedia,
        UserPost,
        Comment,
        LikeDislike,
        
        ]),
        MulterModule.register({
            dest: './post_image',
         
        }) ,
        JwtModule.register({
            secret:'secret',
            signOptions:{
                expiresIn: '1d',
                }
            }),
            UsersModule
    ],
    providers:[PostService, ],
    controllers:[PostController]
})
export class PostModule {}
 