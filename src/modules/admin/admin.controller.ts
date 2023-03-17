import { Controller, Get, Param, Patch, UseGuards ,Post, Body, Query, Req, Res} from "@nestjs/common";
import { Request, Response } from "express";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorators";
import { RolesGuard } from "../auth/roles.guards";
import { AdminModule } from "./admin.module";
import { AdminService } from "./admin.service";

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController{
    constructor(
        private adminService: AdminService,
    ) { }
   
    //get lists of all the users
    @UseGuards(AdminRoleGuard)
    @Get('allUser')
    async allUser(@Res() res:Response,  @Query() { page, take , user_name },){
        return await this.adminService.getAllUser(res ,page, take, user_name);
    }

    //activate or inactivate users
    @UseGuards(AdminRoleGuard)
    @Patch('activeInactive/:id')
    async activeInactive(@Param('id') id:number,@Res() res:Response)
    {
        return await this.adminService.activeInactive(id,res);
        
    }

    //get posts by speacific user
    @UseGuards(AdminRoleGuard)
    @Get('getPostByUser/:id')
    async getPostByUser(@Param('id') id:number,@Res() res:Response ){
        return await this.adminService.getPostByUser(id, res);
    }

    @Get('logout')
    async logout(@Res() res: Response){
        return res.clearCookie('jwt');
    }
}