import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { PostCommentDto } from './dto';

@Injectable()
export class CommentService {
    constructor(private readonly databaseService: DatabaseService, private readonly config:ConfigService) { }

    async getOne(commentId:number,user){
        const comment=await this.databaseService.comment.findUnique({where:{id:commentId}});
        if(!comment)throw new NotFoundException('Comment not found');
        const ticket=await this.databaseService.ticket.findUnique({where:{id:comment.ticketId}});
        if(!ticket)throw new NotFoundException('Ticket not found');

        if(user.role=="ADMIN" || user.id==comment.senderId || user.id==ticket.requesterId || user.id==ticket.agentId)return comment;
        throw new UnauthorizedException();
    }

    async getInside(ticketId:number,user){
        const ticket=await this.databaseService.ticket.findUnique({where:{id:ticketId}});
        if(!ticket)throw new NotFoundException('Ticket not found');

        if(user.role=="ADMIN" || user.id==ticket.requesterId || user.id==ticket.agentId){
            return await this.databaseService.comment.findMany({where:{ticketId}})
        }
        
        throw new UnauthorizedException();
    }

    async post(ticketId:number,dto:PostCommentDto,user){
        const ticket=await this.databaseService.ticket.findUnique({where:{id:ticketId}});
        if(!ticket)throw new NotFoundException('Ticket not found');

        if(user.role=="ADMIN" || user.id==ticket.requesterId || user.id==ticket.agentId){
            return await this.databaseService.comment.create({
                data:{
                    message:dto.message,
                    sender:{connect:{id:user.id}},
                    ticket:{connect:{id:ticketId}}
                }
            })
        }

        throw new UnauthorizedException();
    }

    async delete(commentId:number,user){
        const comment=await this.databaseService.comment.findUnique({where:{id:commentId}});
        if(!comment)throw new NotFoundException('Comment not found');
        const ticket=await this.databaseService.ticket.findUnique({where:{id:comment.ticketId}});
        if(!ticket)throw new NotFoundException('Ticket not found');

        if(user.role=="ADMIN" || user.id==comment.senderId)return await this.databaseService.comment.delete({where:{id:commentId}});
        throw new UnauthorizedException();
    }
}
