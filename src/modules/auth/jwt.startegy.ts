import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor() {
      super({
         jwtFromRequest: function(req) {
            var jwt = null;
            if (req && req.cookies)
            {
                jwt = req.cookies['jwt'];
            }
            return jwt;
        }, 
         secretOrKey: 'secret',

      })
   }
   async validate(payload: any){

      return {
         email: payload.email
         
      }
   }

}