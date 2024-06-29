import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    register(@Body(ValidationPipe) dto:AuthDto){
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body(ValidationPipe) dto:AuthDto){
        return this.authService.login(dto);
    }
}
