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
   
    // @UseGuards(RolesGuard)
    // @Roles('admin')
    @UseGuards(AdminRoleGuard)
    @Get('allUser')
    async allUser(@Res() res:Response,  @Query() { page, take , user_name },){
        return await this.adminService.getAllUser(res ,page, take, user_name);
    }

    @UseGuards(AdminRoleGuard)
    @Patch('activeInactive/:id')
    async activeInactive(@Param('id') id:number,@Res() res:Response)
    {
        return await this.adminService.activeInactive(id,res);
        
    }

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