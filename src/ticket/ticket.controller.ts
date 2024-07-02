import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto';
import { User } from 'src/auth/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('ticket')
export class TicketController {
    constructor(private readonly ticketService: TicketService){}

    @UseGuards(JwtGuard)
    @Get()
    getAll(@User() user){
        switch(user.role){
            case "ADMIN":
            return this.ticketService.getAll();
            case "AGENT":
            return this.ticketService.getByAgentId(user.sub);
            case "CUSTOMER":
            return this.ticketService.getByRequesterId(user.sub);
        }
        
    }

    @UseGuards(JwtGuard)
    @Post()
    create(@User('sub') userId:number,@Body(ValidationPipe) dto:CreateTicketDto){
        return this.ticketService.create(userId,dto);
    }
}
