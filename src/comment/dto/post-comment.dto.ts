import { IsString,IsNotEmpty} from "class-validator";

export class PostCommentDto{
    
    @IsString()
    @IsNotEmpty()
    message: string
}