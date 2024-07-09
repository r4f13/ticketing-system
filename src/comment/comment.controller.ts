import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { User } from 'src/auth/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CommentService } from './comment.service';
import { PostCommentDto } from './dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService){}

    @UseGuards(JwtGuard)
    @Get(':id')
    getOne(@User() user,@Param('id',ParseIntPipe) commentId){
        return this.commentService.getOne(commentId,{id:user.id,role:user.role})
    }

    @UseGuards(JwtGuard)
    @Get('ticket/:ticketId')
    getInside(@User() user,@Param('ticketId',ParseIntPipe) ticketId){
        return this.commentService.getInside(ticketId,{id:user.id,role:user.role})
    }

    @UseGuards(JwtGuard)
    @Post('ticket/:ticketId')
    post(@User() user,@Param('ticketId',ParseIntPipe) ticketId,@Body(ValidationPipe) dto:PostCommentDto){
        return this.commentService.post(ticketId,dto,{id:user.id,role:user.role});
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    delete(@User() user,@Param('id',ParseIntPipe) commentId){
        return this.commentService.delete(commentId,{id:user.id,role:user.role})
    }
}
