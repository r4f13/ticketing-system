import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTicketDto } from './dto';

@Injectable()
export class TicketService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getAll(){
      return await this.databaseService.ticket.findMany();
    }

    async getByRequesterId(requesterId:number){
      return await this.databaseService.ticket.findMany({where:{requesterId}});
    }

    async getByAgentId(agentId:number){
      return await this.databaseService.ticket.findMany({where:{agentId}});
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
