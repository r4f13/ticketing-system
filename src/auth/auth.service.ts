import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { loginDto, registerDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private readonly jwt:JwtService, private readonly config:ConfigService){}

    async register(dto:registerDto){
        try{
            const password = await argon.hash(dto.password);
            const user =  await this.databaseService.user.create({
                data: {
                    username:dto.username.toLowerCase(),
                    password,
                    role:dto.role
                }
            });

            return this.signToken(user.id,user.username);
        }catch(error){
           if(error instanceof PrismaClientKnownRequestError && error.code=="P2002")throw new ForbiddenException("Username is taken");
            throw error;
        } 
    }

    async login(dto:loginDto){
        const user = await this.databaseService.user.findUnique({
            where:{username:dto.username.toLowerCase()}
        })
        if(!user)throw new ForbiddenException("Username or password is incorrect");

        const match=await argon.verify(user.password,dto.password);
        if(!match)throw new ForbiddenException("Username or password is incorrect");

        return this.signToken(user.id,user.username);
    }

    async signToken(id:number,username:string,) {
        const payload = {
          sub: id,
          username,
        };
        const secret = this.config.get('JWT_SECRET');
    
        const token = await this.jwt.signAsync(
          payload,
          {
            expiresIn: '60m',
            secret: secret,
          },
        );
    
        return {
          access_token: token,
        };
    }
}
