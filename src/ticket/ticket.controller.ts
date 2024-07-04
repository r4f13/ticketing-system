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
            return this.ticketService.getByAgentId(user.id,filter);
            case "CUSTOMER":
            return this.ticketService.getByRequesterId(user.id,filter);
        }
        
    }

    @UseGuards(JwtGuard)
    @Post()
    create(@User('sub') userId:number,@Body(ValidationPipe) dto:CreateTicketDto){
        return this.ticketService.create(userId,dto);
    }

    @UseGuards(JwtGuard)
    @Patch(':id')
    edit(@Param('id',ParseIntPipe) ticketId:number,@User() user,@Body(ValidationPipe) dto:EditTicketDto){
        return this.ticketService.edit(ticketId,dto,{id:user.id,role:user.role});
    }

    @UseGuards(JwtGuard)
    @Get(':ticketId/assign/:agentId')
    assign(@User('role') userRole, @Param('ticketId',ParseIntPipe) ticketId:number, @Param('agentId',ParseIntPipe) agentId:number){
        if(userRole!=="ADMIN")throw new UnauthorizedException();
        return this.ticketService.assign(ticketId,agentId);
    }
}
