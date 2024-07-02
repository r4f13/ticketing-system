import { Role } from "@prisma/client";
import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class registerDto{
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    @IsOptional()
    role?: "CUSTOMER" | "AGENT" | "ADMIN";
}