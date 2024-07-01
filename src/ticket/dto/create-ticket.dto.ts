import { IsString,IsNotEmpty, IsNumber } from "class-validator";

export class CreateTicketDto{
    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    statusId: number;

    @IsNumber()
    @IsNotEmpty()
    priorityId: number;
}