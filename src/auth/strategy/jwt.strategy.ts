import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(config:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    validate(payload: {
        sub: number;
        username: string;
      }) {
        return payload;
      }

      // async validate(payload: {
      //   sub: number;
      //   username: string;
      // }) {
      //   const user= await this.databaseService.user.findUnique({
      //     where:{id:payload.sub}
      //   });

      //   delete user.hash;
      //   return user;
      // }
}