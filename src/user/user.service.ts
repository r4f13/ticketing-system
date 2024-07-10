import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
    constructor(private readonly databaseService: DatabaseService){}

    async getAll(){
        return await this.databaseService.user.findMany({
            select:{
                id:true,
                username:true,
                role:true,
                createdAt:true,
                updatedAt:true
            }
        });
    }

    async getOne(userId){
        const user = await this.databaseService.user.findUnique({
            select:{
                id:true,
                username:true,
                role:true,
                createdAt:true,
                updatedAt:true
            },
            where:{id:userId}}
        );

        if(!user)throw new NotFoundException('User not found');
        return user;
    }

    async promote(userId,newRole){
        if(!(newRole=='ADMIN' || newRole=="AGENT" || newRole=="CUSTOMER"))throw new ForbiddenException("Invalid role")

        const user=await this.databaseService.user.findUnique({where:{id:userId}});
        if(!user)throw new NotFoundException('User not found');

        await this.databaseService.user.update({
            where:{id:userId},
            data:{role:newRole}
        })

        return "Success"
    }
}
