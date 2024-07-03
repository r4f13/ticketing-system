import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTicketDto } from './dto';

@Injectable()
export class TicketService {
    constructor(private readonly databaseService: DatabaseService) { }

    private toInteger(obj){
      Object.keys(obj).forEach(prop=>{
        obj[prop]=isNaN(obj[prop])?obj[prop]:parseInt(obj[prop]);
      })
      return obj
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
        return this.databaseService.ticket.create({
            data: {
              subject: dto.subject,
              description: dto.description,
              status: {connect:{id:dto.statusId}},
              priority: {connect:{id:dto.priorityId}},
              requester: {connect:{id:requesterId}}
            }
          })
    }
}
