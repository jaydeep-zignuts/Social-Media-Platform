import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSocialMedia } from 'src/entities/user_socialmedia.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { LocalStrategy } from './local.strategy';

@Module({
    imports:[TypeOrmModule.forFeature([ UserSocialMedia ]), PassportModule,
    
    // JwtModule.register({
    //     secret:'secret',
    //     signOptions:{
    //         expiresIn: '1d',
    //     },
        
    // }),
    UsersModule
    ],
    providers:[AuthService, JwtStrategy, LocalStrategy ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
