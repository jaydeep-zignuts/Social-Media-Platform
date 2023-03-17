import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSocialMediaDto } from 'src/dto/user_socialmedia.dto';
import { FollowUnfollw } from 'src/entities/followunfollw.entity';
import { UserSocialMedia } from 'src/entities/user_socialmedia.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
    imports:[ 
        TypeOrmModule.forFeature([ UserSocialMedia ,FollowUnfollw ]), 
        MulterModule.register({
        dest: './profile_image',
    
    }),
    // JwtModule.register({
    //     secret:'secret',
    //     signOptions:{
    //         expiresIn: '1d',
    //         }
    //     }),
        
    ], 
    providers:[UserService],
    controllers:[UserController],
    exports: [UserService]
})
export class UsersModule {}
