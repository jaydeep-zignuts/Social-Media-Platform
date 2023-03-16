import { Body, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }
    async validate(email: string, password: string): Promise<any> {

        const userdata = await this.authService.validateUserCreds(email, password);
        if (!userdata) throw new UnauthorizedException();
        return await userdata;
    }
}