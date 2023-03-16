import { Body, Controller, Get, Post, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private userService: UserService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Body('email') email,
        @Res({ passthrough: true }) response: Response

    ): Promise<any> {
        const user =await this.userService.findUserByEmail(email);
       
        return await this.authService.generateToken(user.id,response);
    }

}
