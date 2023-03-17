import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowUnfollw } from 'src/entities/followunfollw.entity';
import { UserSocialMedia } from 'src/entities/user_socialmedia.entity';
import { AdminModule } from '../admin/admin.module';
import { PostModule } from '../post/post.module';
import { PostService } from '../post/post.service';
import { UsersModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { LocalStrategy } from './local.strategy';

@Module({
    imports:[TypeOrmModule.forFeature([ UserSocialMedia ]), PassportModule,

    UsersModule,
    JwtModule.register({
        secret:'secret',
        signOptions:{
            expiresIn: '1d',
        },
        
    }), 
    ],
    providers:[AuthService, JwtStrategy, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
    
    