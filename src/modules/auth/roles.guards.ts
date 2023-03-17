import { CanActivate, ExecutionContext, Injectable, Res } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Response } from "express";
import { UserService } from "../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector, private userService  : UserService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        const request = context.switchToHttp().getRequest();
        console.log(roles);
        console.log(request.user);
        // let res:Response;
        if(request?.user){
        console.log("fgfd",request);
            
            const { id } = request.user;
            const user = await this.userService.getUserById(id);
            console.log(user.role );
            return roles.includes(user.role)
        }
        
        return false;

    }

}