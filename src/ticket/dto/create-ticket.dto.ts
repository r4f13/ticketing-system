import { IsString,IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateTicketDto{
    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsOptional()
    statusId: number;

    @IsNumber()
    @IsNotEmpty()
    priorityId: number;
}