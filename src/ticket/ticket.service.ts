import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTicketDto, EditTicketDto } from './dto';
import { Role } from '@prisma/client';

@Injectable()
export class TicketService {
    constructor(private readonly databaseService: DatabaseService) { }

    private toInteger(obj){
      Object.keys(obj).forEach(prop=>{
        obj[prop]=isNaN(obj[prop])?obj[prop]:parseInt(obj[prop]);
      })
      return obj
    }

    private authorizeDto(obj,dto){
      Object.keys(obj).forEach(prop=>{
        if(!dto.includes(prop))throw new UnauthorizedException(`Unauthorized to edit ${prop}`);
      })
    }

    async getOne(ticketId:number,nonAdminUserId?:number){
      const ticket=await this.databaseService.ticket.findUnique({where:{id:ticketId}});
      if(!ticket)throw new NotFoundException('Ticket not found');

      if(nonAdminUserId===undefined || ticket.requesterId==nonAdminUserId || ticket.agentId==nonAdminUserId)return ticket;
      throw new UnauthorizedException();
    }
    
    async getAll(filter:object){
      if(filter)filter=this.toInteger(filter);
      return await this.databaseService.ticket.findMany({where:filter});
    }

    async getByRequesterId(requesterId:number,filter?:object){
      if(filter)filter=this.toInteger(filter);
      return await this.databaseService.ticket.findMany({where:{requesterId,...filter}});
    }

    async getByAgentId(agentId:number,filter?:object){
      if(filter)filter=this.toInteger(filter);
      return await this.databaseService.ticket.findMany({where:{agentId,...filter}});
    }

    async create(requesterId:number,dto:CreateTicketDto){
      const expiresIn=(await this.databaseService.priority.findUnique({where:{id:dto.priorityId}})).expiresIn;

        return this.databaseService.ticket.create({
            data: {
              subject: dto.subject,
              description: dto.description,
              status: {connect:{id:dto.statusId}},
              priority: {connect:{id:dto.priorityId}},
              requester: {connect:{id:requesterId}},
              expiredAt:  new Date(new Date().getTime()+expiresIn)
            }
          })
    }

    async edit(ticketId:number,dto:EditTicketDto,user:{id:number,role:Role}){
      const ticket=await this.databaseService.ticket.findUnique({where:{id:ticketId}});
      if(!ticket)throw new NotFoundException('Ticket not found');

      if(user.role=="ADMIN"){
        return await this.databaseService.ticket.update({
          where: {id:ticketId},
          data: dto
        })
      }
      
      if(user.role=="CUSTOMER" &&  ticket.requesterId==user.id){
        this.authorizeDto(dto,['subject','description','priorityId']);
        return await this.databaseService.ticket.update({
          where: {id:ticketId},
          data: dto
        })
      }

      if(user.role=="AGENT" &&  ticket.agentId==user.id){
        this.authorizeDto(dto,['statusId','priorityId']);
        return await this.databaseService.ticket.update({
          where: {id:ticketId},
          data: dto
        })
      }
    }

    async assign(ticketId:number,agentId:number){
      const agent=await this.databaseService.user.findUnique({where:{id:agentId}});
      if(!agent)throw new NotFoundException('Agent not found');

      if(agent.role=="CUSTOMER")throw new ForbiddenException("Unable to assign ticket to a customer");

      return await this.databaseService.ticket.update({
        where: {id:ticketId},
        data: {agentId,statusId:2}
      })
    }
}
