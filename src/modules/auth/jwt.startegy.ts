import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserSocialMedia } from "src/entities/user_socialmedia.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor(
      @InjectRepository(UserSocialMedia) private userRepository:Repository<UserSocialMedia>
   ) {
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
      const user = await this.userRepository.findOne({where:{email: payload.email}})
      return {
         id: payload.id,
         user: user
      }
   }

}