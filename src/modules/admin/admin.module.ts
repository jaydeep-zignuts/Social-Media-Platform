import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPost } from 'src/entities/userpost.entity';
import { UserSocialMedia } from 'src/entities/user_socialmedia.entity';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports:[UsersModule, TypeOrmModule.forFeature([UserSocialMedia, UserPost])],
    providers:[AdminService],
    controllers:[AdminController],
    exports:[AdminService]
})
export class AdminModule {}
