import { PostCommentDto } from "./post-comment.dto";
import { PartialType } from "@nestjs/swagger";

export class EditCommentDto extends PartialType(PostCommentDto){}