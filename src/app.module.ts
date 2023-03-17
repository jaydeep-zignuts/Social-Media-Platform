import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmAsyncConfig } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './modules/post/post.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [ 
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(TypeOrmAsyncConfig),
    PostModule,
    {
      ...JwtModule.register({
        secret:process.env.APP_SECRET,
        signOptions:{
            expiresIn: '1d',
        },
      }),
      global: true
    },
    AdminModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService], 
  exports: [JwtModule]
})
export class AppModule {}
