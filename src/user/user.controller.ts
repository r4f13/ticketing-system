import { Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { User } from 'src/auth/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserService } from './user.service';
import { Role } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}
    
    @UseGuards(JwtGuard)
    @Get('/self')
    getSelf(@User() user){
        return user;
    }

    @UseGuards(JwtGuard)
    @Get('')
    getAll(@User('role') userRole){
        if(userRole=='ADMIN')return this.userService.getAll();

        throw new UnauthorizedException();
    }

    @UseGuards(JwtGuard)
    @Get(':role')
    getByRole(@User('role') userRole,@Param('role') role:string){
        role=role.toUpperCase();
        if(!(role=='ADMIN' || role=="AGENT" || role=="CUSTOMER"))throw new ForbiddenException("Invalid role")
        if(userRole=='ADMIN')return this.userService.getAll({role});

        throw new UnauthorizedException();
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    getOne(@User() user,@Param('id',ParseIntPipe) userId:number){
        if(user.role=='ADMIN' || user.id==userId)return this.userService.getOne(userId);

        throw new UnauthorizedException();
    }

    @UseGuards(JwtGuard)
    @Get(':userId/promote/:newRole')
    promote(@User('role') userRole,@Param('userId',ParseIntPipe) userId,@Param('newRole') newRole){
        if(userRole=='ADMIN')return this.userService.promote(userId,newRole.toUpperCase());

        throw new UnauthorizedException();
    }
}
