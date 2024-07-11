import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, EditTicketDto } from './dto';
import { User } from 'src/auth/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('ticket')
export class TicketController {
    constructor(private readonly ticketService: TicketService){}

    @UseGuards(JwtGuard)
    @Get(':id')
    getOne(@User() user, @Param('id',ParseIntPipe) ticketId:number){
        if(user.role=="ADMIN")return this.ticketService.getOne(ticketId); 
        return this.ticketService.getOne(ticketId,user.id);
    }

    @UseGuards(JwtGuard)
    @Get()
    getAll(@User() user,@Query() filter){
        switch(user.role){
            case "ADMIN":
            return this.ticketService.getAll(filter);
            case "AGENT":
            return this.ticketService.getAll({...filter,agentId:user.id});
            case "CUSTOMER":
            return this.ticketService.getAll({...filter,requesterId:user.id});
        }
        
    }

    @UseGuards(JwtGuard)
    @Post()
    create(@User() user,@Body(ValidationPipe) dto:CreateTicketDto){
        return this.ticketService.create(dto,{id:user.id,role:user.role});
    }

    @UseGuards(JwtGuard)
    @Patch(':id')
    edit(@Param('id',ParseIntPipe) ticketId:number,@User() user,@Body(ValidationPipe) dto:EditTicketDto){
        return this.ticketService.edit(ticketId,dto,{id:user.id,role:user.role});
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) ticketId:number,@User() user){
        if(user.role=="AGENT")throw new UnauthorizedException();
        return this.ticketService.delete(ticketId,{id:user.id,role:user.role});
    }

    @UseGuards(JwtGuard)
    @Get(':ticketId/assign/:agentId')
    assign(@User('role') userRole, @Param('ticketId',ParseIntPipe) ticketId:number, @Param('agentId',ParseIntPipe) agentId:number){
        if(userRole!=="ADMIN")throw new UnauthorizedException();
        return this.ticketService.assign(ticketId,agentId);
    }

    @UseGuards(JwtGuard)
    @Get(':ticketId/update/:statusId')
    update(@User('') user, @Param('ticketId',ParseIntPipe) ticketId:number, @Param('statusId',ParseIntPipe) statusId:number){
        return this.ticketService.update(ticketId,statusId,{id:user.id,role:user.role});
    }
}
