import { Body, Controller, ForbiddenException, Get, Post, SetMetadata, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { loginDto, registerDto } from './dto';
import { AuthService } from './auth.service';
import { User } from './decorator/user.decorator';
import { ReadonlyJwtGuard } from './guard/readonly.jwt.guard';
import { JwtGuard } from './guard/jwt.guard';
import { get } from 'http';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @UseGuards(ReadonlyJwtGuard)
    @Post('register')
    register(@User() user,@Body(ValidationPipe) dto:registerDto){
        if(!user || !dto.role)dto.role="CUSTOMER";
        if(dto.role=="CUSTOMER" || user && user.role=="ADMIN") return this.authService.register(dto);
        else{
            throw new UnauthorizedException();
        }  
    }

    @Post('login')
    login(@Body(ValidationPipe) dto:loginDto){
        return this.authService.login(dto);
    }

    @UseGuards(JwtGuard)
    @Get()
    getInfo(@User() user){
        return user;
    }
}
