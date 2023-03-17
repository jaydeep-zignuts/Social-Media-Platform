import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { UserRoles } from "./user.enums";


@Injectable()
export class AdminRoleGuard implements CanActivate{
    constructor(private userService: UserService){

    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
console.log(request.user);

        if(request?.user){
            const { id } = request.user;
            const user = await this.userService.getUserById(id);
            return user.role === UserRoles.ADMIN;
        }

        return false;
    }

}