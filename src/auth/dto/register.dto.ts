import { IsString, IsNotEmpty } from "class-validator";

export class registerDto{
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    role?: "CUSTOMER" | "AGENT" | "ADMIN";
}